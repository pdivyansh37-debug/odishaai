"""
Seed initial data for GraamSeva AI:
1. Admin officer account
2. 8 real Odisha government schemes with rules
3. Sample grievances across Odisha districts for demo heatmap and dashboard
"""

import sys
import os
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.officer import Officer, OfficerRole
from app.models.scheme import Scheme
from app.models.citizen import Citizen
from app.models.grievance import Grievance, GrievanceCategory, GrievanceStatus
from app.utils.auth import get_password_hash

SCHEMES_DATA = [
    {
        "name_odia": "ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (BSKY)",
        "name_en": "Biju Swasthya Kalyan Yojana (BSKY)",
        "dept": "Health & Family Welfare",
        "benefits": "Free healthcare coverage up to ₹5 Lakh per family per annum (up to ₹10 Lakh for women family members) at over 600 empanelled hospitals across India.",
        "rules_json": {
            "income_max": 300000,
            "caste": ["SC", "ST", "OBC", "General"],
            "requires_bpl_card": True,
        },
        "eligibility_criteria": {
            "income_max": 300000,
            "bpl": True,
            "residence": "Odisha",
            "coverage_amount": "₹5,00,000 - ₹10,00,000",
        },
        "documents_required": [
            "BSKY Smart Card or NFSA/SFSS Ration Card",
            "Aadhaar Card of all family members",
            "Resident Certificate of Odisha",
        ],
    },
    {
        "name_odia": "କାଳିଆ ଯୋଜନା (KALIA)",
        "name_en": "Krushak Assistance for Livelihood and Income Augmentation (KALIA)",
        "dept": "Agriculture & Farmers' Empowerment",
        "benefits": "₹10,000 per year direct financial assistance for cultivation (₹5,000 for Kharif + ₹5,000 for Rabi) + ₹12,500 for landless agricultural households.",
        "rules_json": {
            "occupation": ["farmer", "laborer", "agricultural_laborer"],
            "land_max": 5.0,
            "caste": ["SC", "ST", "OBC", "General"],
        },
        "eligibility_criteria": {
            "occupation": "Small/marginal farmer or landless agricultural household",
            "land_max_acres": 5.0,
            "residence": "Odisha",
        },
        "documents_required": [
            "Aadhaar Card",
            "Bank Passbook linked with Aadhaar",
            "Land ownership record (RoR / Patta) or Landless certificate",
            "Ration Card",
        ],
    },
    {
        "name_odia": "ମମତା ଯୋଜନା (MAMATA)",
        "name_en": "Mamata Yojana",
        "dept": "Women & Child Development",
        "benefits": "Conditional cash transfer of ₹5,000 in two installments to pregnant and lactating women aged 19 and above for first two live births.",
        "rules_json": {
            "gender": "female",
            "age_min": 19,
            "max_children": 2,
        },
        "eligibility_criteria": {
            "gender": "Female",
            "age_min": 19,
            "condition": "Pregnant or lactating mother (up to 2 live births)",
            "restriction": "Excludes government/PSU employees",
        },
        "documents_required": [
            "MCP Card (Mother & Child Protection Card)",
            "Aadhaar Card of mother",
            "Bank Account in mother's name linked with Aadhaar",
        ],
    },
    {
        "name_odia": "ମିଶନ ଶକ୍ତି (Mission Shakti)",
        "name_en": "Mission Shakti Self-Help Group (SHG) Scheme",
        "dept": "Mission Shakti Department",
        "benefits": "Interest-free loans up to ₹5 Lakh, seed capital of ₹15,000 per SHG, revolving fund support, market linkage, and institutional business support.",
        "rules_json": {
            "gender": "female",
            "age_min": 18,
            "occupation": ["self_employed", "shg_member", "homemaker", "artisan"],
        },
        "eligibility_criteria": {
            "target": "Women members of registered Self-Help Groups in Odisha",
            "age_min": 18,
            "loan_benefit": "0% interest up to ₹5,00,000",
        },
        "documents_required": [
            "SHG Registration Certificate",
            "SHG Bank Passbook",
            "Aadhaar Card of members",
            "Resolution copy of SHG for loan",
        ],
    },
    {
        "name_odia": "ମଧୁବାବୁ ପେନସନ ଯୋଜନା (MBPY)",
        "name_en": "Madhu Babu Pension Yojana (MBPY)",
        "dept": "Social Security & Empowerment of Persons with Disabilities",
        "benefits": "Monthly pension of ₹500 - ₹1,000 for senior citizens (60+ years), widows, persons with 40%+ disabilities, and destitute individuals.",
        "rules_json": {
            "income_max": 24000,
            "conditions_any": ["age_min_60", "is_widow", "has_disability"],
        },
        "eligibility_criteria": {
            "annual_family_income_max": 24000,
            "categories": "Senior citizen (60+), Widow of any age, Person with disability (40%+)",
            "residence": "Permanent resident of Odisha",
        },
        "documents_required": [
            "Age proof / Aadhaar Card",
            "Income Certificate from Tahsildar",
            "Disability Certificate (if applicable)",
            "Death Certificate of husband (for widows)",
            "Bank Passbook",
        ],
    },
    {
        "name_odia": "ବିଜୁ ପକ୍କା ଘର ଯୋଜନା (BPGY)",
        "name_en": "Biju Pucca Ghar Yojana (BPGY)",
        "dept": "Panchayati Raj & Drinking Water",
        "benefits": "Financial assistance of ₹1.20 Lakh (Plain area) to ₹1.30 Lakh (IAP/Hilly district) + 90 person-days of MGNREGS wages for constructing a pucca house.",
        "rules_json": {
            "income_max": 120000,
            "has_pucca_house": False,
        },
        "eligibility_criteria": {
            "target": "Rural households living in kutcha houses",
            "condition": "Must not own a pucca house anywhere in India",
            "benefit": "₹1,20,000 - ₹1,30,000 direct bank transfer in 4 installments",
        },
        "documents_required": [
            "Aadhaar Card",
            "Ration Card / BPL number",
            "Land Patta or land allotment letter",
            "Bank Passbook",
            "Photograph of existing kutcha house",
        ],
    },
    {
        "name_odia": "ମୁଖ୍ୟମନ୍ତ୍ରୀ କୃଷି ଉଦ୍ୟୋଗ ଯୋଜନା (MKUY)",
        "name_en": "Mukhyamantri Krishi Udyog Yojana (MKUY)",
        "dept": "Agriculture & Farmers' Empowerment",
        "benefits": "Capital Investment Subsidy (CIS) up to 40% (up to ₹50 Lakh for General, 50% for SC/ST/Women/Graduates) for setting up agro-enterprises in Odisha.",
        "rules_json": {
            "age_min": 18,
            "age_max": 65,
            "occupation": ["farmer", "entrepreneur", "self_employed", "graduate"],
        },
        "eligibility_criteria": {
            "target": "Individual entrepreneurs, SHGs, FPOs, and graduates establishing commercial agricultural ventures",
            "subsidy": "Up to ₹50 Lakh Capital Investment Subsidy",
        },
        "documents_required": [
            "Detailed Project Report (DPR)",
            "Land Records (minimum lease 15 years or owned land)",
            "Aadhaar Card & PAN Card",
            "Bank Appraisal / Sanction Letter",
        ],
    },
    {
        "name_odia": "ଓଡ଼ିଶା ଆଦର୍ଶ ବିଦ୍ୟାଳୟ ବୃତ୍ତି (OAVS)",
        "name_en": "Odisha Adarsha Vidyalaya Merit Scholarship",
        "dept": "School & Mass Education Department",
        "benefits": "Free quality English-medium CBSE education, free hostel accommodation, study materials, uniforms, and merit scholarships for rural talents.",
        "rules_json": {
            "age_min": 10,
            "age_max": 18,
            "education_level": ["primary", "secondary"],
        },
        "eligibility_criteria": {
            "target": "Students passing entrance test for Class VI-XII in rural Odisha blocks",
            "reservation": "50% reservation for girl students",
        },
        "documents_required": [
            "Previous Class Marksheet / Pass Certificate",
            "Birth Certificate",
            "Aadhaar Card of student and parent",
            "Caste Certificate (if SC/ST/OBC)",
            "Resident Certificate",
        ],
    },
]

DEMO_GRIEVANCES = [
    {
        "ticket_id": "GS-ROAD-2026-001001",
        "category": GrievanceCategory.road,
        "dept": "Works Department",
        "status": GrievanceStatus.pending,
        "lat": 20.2961,
        "lng": 85.8245,
        "district": "Khordha",
        "desc": "Main village road connecting Balipatna to NH-16 has large potholes after heavy rain, making transport impossible.",
        "phone": "9876543210",
        "name": "Bikash Mohanty",
    },
    {
        "ticket_id": "GS-WATER-2026-001002",
        "category": GrievanceCategory.water,
        "dept": "Panchayati Raj & Drinking Water",
        "status": GrievanceStatus.in_progress,
        "lat": 20.4625,
        "lng": 85.8830,
        "district": "Cuttack",
        "desc": "Village tubewell has been non-functional for past 2 weeks in Salepur block. 50 families facing drinking water shortage.",
        "phone": "9876543211",
        "name": "Priyanka Sahoo",
    },
    {
        "ticket_id": "GS-RATION-2026-001003",
        "category": GrievanceCategory.ration,
        "dept": "Food Supplies & Consumer Welfare",
        "status": GrievanceStatus.resolved,
        "lat": 19.8135,
        "lng": 85.8312,
        "district": "Puri",
        "desc": "PDS dealer in Satyabadi block refused to distribute November quota rice and demanding extra charges.",
        "phone": "9876543212",
        "name": "Kailash Nayak",
    },
    {
        "ticket_id": "GS-HEALTH-2026-001004",
        "category": GrievanceCategory.health,
        "dept": "Health & Family Welfare",
        "status": GrievanceStatus.pending,
        "lat": 21.4669,
        "lng": 83.9812,
        "district": "Sambalpur",
        "desc": "Primary Health Centre (PHC) lacks emergency snake bite antivenom and doctor was absent during duty hours.",
        "phone": "9876543213",
        "name": "Dipti Behera",
    },
    {
        "ticket_id": "GS-EDUCATION-2026-001005",
        "category": GrievanceCategory.education,
        "dept": "School & Mass Education Department",
        "status": GrievanceStatus.in_progress,
        "lat": 19.3149,
        "lng": 84.7941,
        "district": "Ganjam",
        "desc": "Government primary school building ceiling has cracks and leaks during rain. Children safety at risk.",
        "phone": "9876543214",
        "name": "Ramesh Chandra Das",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("🌱 Seeding GraamSeva AI database...")

    # 1. Admin Officer
    admin_email = "admin@graamseva.gov.in"
    existing_admin = db.query(Officer).filter(Officer.email == admin_email).first()
    if not existing_admin:
        admin = Officer(
            name="Panchayat Nodal Officer",
            email=admin_email,
            hashed_password=get_password_hash("Admin@123"),
            dept="General Administration",
            district="Bhubaneswar",
            role=OfficerRole.admin,
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print(f"✅ Created Admin: {admin_email} / Admin@123")
    else:
        print("ℹ️ Admin officer already exists.")

    # 2. Schemes
    for s_data in SCHEMES_DATA:
        existing = db.query(Scheme).filter(Scheme.name_en == s_data["name_en"]).first()
        if not existing:
            scheme = Scheme(
                name_odia=s_data["name_odia"],
                name_en=s_data["name_en"],
                dept=s_data["dept"],
                benefits=s_data["benefits"],
                rules_json=s_data["rules_json"],
                eligibility_criteria=s_data["eligibility_criteria"],
                documents_required=s_data["documents_required"],
                is_active=True,
            )
            db.add(scheme)
            print(f"✅ Added Scheme: {s_data['name_en']}")
    db.commit()

    # 3. Sample Grievances & Citizens
    for g_data in DEMO_GRIEVANCES:
        existing_g = db.query(Grievance).filter(Grievance.ticket_id == g_data["ticket_id"]).first()
        if not existing_g:
            citizen = db.query(Citizen).filter(Citizen.phone == g_data["phone"]).first()
            if not citizen:
                citizen = Citizen(
                    phone=g_data["phone"],
                    name=g_data["name"],
                    district=g_data["district"],
                )
                db.add(citizen)
                db.commit()
                db.refresh(citizen)

            sla_deadline = datetime.now(timezone.utc) + timedelta(days=7)
            grievance = Grievance(
                ticket_id=g_data["ticket_id"],
                citizen_id=citizen.id,
                category=g_data["category"],
                dept_assigned=g_data["dept"],
                status=g_data["status"],
                sla_deadline=sla_deadline,
                lat=g_data["lat"],
                lng=g_data["lng"],
                description=g_data["desc"],
                resolved_at=datetime.now(timezone.utc) if g_data["status"] == GrievanceStatus.resolved else None,
            )
            db.add(grievance)
            print(f"✅ Added Grievance Ticket: {g_data['ticket_id']}")
    db.commit()

    print("🎉 Seeding completed successfully!")
    db.close()


if __name__ == "__main__":
    seed()

