// Faculty data extracted from https://kecua.ac.in/index.php/faculty-2/
// Images are proxied from the KEC website member profile pages

export interface FacultyMember {
  name: string;
  position: string;
  phone?: string;
  email?: string;
  department: string;
  departmentShort: string;
  qualification?: string;
  areaOfInterest?: string;
  profileUrl: string;
}

export interface Department {
  name: string;
  shortName: string;
  members: FacultyMember[];
}

export const departments: Department[] = [
  {
    name: "Computer Science & Engineering / MCA",
    shortName: "CSE",
    members: [
      {
        name: "Dr. Kunwar Singh Vaisla",
        position: "Professor",
        phone: "9927122999",
        email: "vaislaks@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "MCA, PhD",
        areaOfInterest: "Distributed Computing",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-kunwar-singh-vaisla/"
      },
      {
        name: "Dr. Ajit Singh",
        position: "Professor (On Deputation)",
        phone: "7533800042",
        email: "erajit@rediffmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech, M.Tech, PhD",
        areaOfInterest: "Artificial Intelligence",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-ajit-singh/"
      },
      {
        name: "Dr. Rajendra Kumar Bharti",
        position: "Associate Professor & Head",
        phone: "9412666177",
        email: "rajendramail1980@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "PhD(CSE)",
        areaOfInterest: "Data Compression, Network Security",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-rajendra-kumar-bharti/"
      },
      {
        name: "Dr. Archana Verma",
        position: "Assistant Professor",
        phone: "9457894800",
        email: "vermarchana05@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "MCA, PhD",
        areaOfInterest: "Algorithm Analysis, Data Structures, Operating System",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-archana-verma/"
      },
      {
        name: "Dr. Swati Verma",
        position: "Assistant Professor & Head (Civil)",
        phone: "9634636963",
        email: "mgsswati@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech(CSE), M.Tech(CSE), PhD",
        areaOfInterest: "Database Management System, Data Mining, Java Programming",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-swati-verma/"
      },
      {
        name: "Dr. Ramesh Chandra Belwal",
        position: "Assistant Professor",
        phone: "9690579312",
        email: "rameshbelwal@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "PhD, M.Tech, B.Tech",
        areaOfInterest: "Text Summarization",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-ramesh-belwal/"
      },
      {
        name: "Dr. Sachin Gaur",
        position: "Assistant Professor",
        phone: "9412912342",
        email: "sachingaur1234@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech, M.Tech, PhD",
        areaOfInterest: "Digital Image Processing",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-sachin-gaur/"
      },
      {
        name: "Dr. Anindita Saha",
        position: "Assistant Professor",
        phone: "9557004255",
        email: "write.anindita@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech(CSE), M.Tech(CSE), PhD",
        areaOfInterest: "Machine Learning, Recommendation System, Deep Learning",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-anindita-saha-2/"
      },
      {
        name: "Mrs. Bhawana Parihar",
        position: "Assistant Professor",
        phone: "8193051210",
        email: "Feeling2908@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech(CSE), M.Tech(CSE), PhD(Pursuing)",
        areaOfInterest: "Software Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-anindita-saha/"
      },
      {
        name: "Dr. Vishal Kumar",
        position: "Assistant Professor",
        phone: "8193098151",
        email: "kumarvishalji@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "BE(CSE), M.Tech(CSE), PhD(CSE)",
        areaOfInterest: "Computer Network",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-vishal-kumar/"
      },
      {
        name: "Dr. Kapil Chaudhary",
        position: "Assistant Professor",
        phone: "9997344490",
        email: "kapil.cse@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech(CSE), M.Tech(DSP), PhD(CSE)",
        areaOfInterest: "Image Processing, Mixed Reality, Human Computer Interfacing",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-kapil-chaudhary/"
      },
      {
        name: "Mr. Deepak Harbola",
        position: "Programmer",
        phone: "9756009950",
        email: "deepak.harbola@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "MCA, MTech",
        areaOfInterest: "Cyber Security, System Administration",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-deepak-harbola/"
      },
      {
        name: "Mr. Rajeev Chanyal",
        position: "Programmer",
        phone: "8476840400",
        email: "rajeevmca4u@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "MCA, MTech",
        areaOfInterest: "System Administration",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-rajeev-chanyal/"
      },
      {
        name: "Mrs. Poonam Chimwal",
        position: "Assistant Professor (On-Contract)",
        phone: "9557119994",
        email: "poonamwise@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "MCA, M.Tech, PhD(Pursuing)",
        areaOfInterest: "Security, Cryptography",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-poonam-chimwal/"
      },
      {
        name: "Mr. Kuber Singh",
        position: "Assistant Professor (On-Contract)",
        phone: "7409419309",
        email: "spritekuber@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "B.Tech, M.Tech",
        areaOfInterest: "Computer Network",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-kuber-singh/"
      },
      {
        name: "Mrs. Jyoti Harbola",
        position: "Assistant Professor (Guest Faculty)",
        phone: "9927750584",
        email: "jyoti.dalakoti@gmail.com",
        department: "Computer Science & Engineering",
        departmentShort: "CSE",
        qualification: "MCA, MTech",
        areaOfInterest: "Cryptography & Network Security",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-jyoti-harbola/"
      }
    ]
  },
  {
    name: "Mechanical Engineering",
    shortName: "ME",
    members: [
      {
        name: "Dr. Anirudh Gupta",
        position: "Professor",
        phone: "9412995855",
        email: "guptaanirudh87@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "PhD, IIT Kanpur",
        areaOfInterest: "Thermal Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-anirudh-gupta/"
      },
      {
        name: "Dr. Satyendra Singh",
        position: "Professor",
        phone: "9456222807",
        email: "ssinghiitd@rediffmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "PhD, IIT Delhi",
        areaOfInterest: "Design, Structural Mechanics using FEM, Plates & Shells, Composite Structures",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-satyendra-singh/"
      },
      {
        name: "Dr. Ravi Kumar",
        position: "Assistant Professor & Head",
        phone: "9410605112",
        email: "21ravi@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "PhD, IIT (ISM) Dhanbad",
        areaOfInterest: "Friction Surfacing, Friction Stir Welding, Industrial Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-ravi-kumar/"
      },
      {
        name: "Mr. Vinod Kumar",
        position: "Assistant Professor (On-Contract)",
        phone: "9458948750",
        email: "vinod.iitr9@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M. Tech, IIT Roorkee",
        areaOfInterest: "Metallurgical and Materials Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-vinod-kumar/"
      },
      {
        name: "Ms. Kavita Puri",
        position: "Assistant Professor (On-Contract)",
        phone: "7248014809",
        email: "kavitapuri51@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M. Tech, IIT Roorkee",
        areaOfInterest: "Metallurgical and Materials Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/ms-kavita-puri/"
      },
      {
        name: "Mr. Saumy Agarwal",
        position: "Assistant Professor (STEF)",
        phone: "8790443216",
        email: "saumy.agarwal.90@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech (Product Design) – NIT Warangal",
        areaOfInterest: "Metal Matrix Composites, 3D Printing",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-saumy-agarwal/"
      },
      {
        name: "Mr. Manish Upreti",
        position: "Assistant Professor (STEF)",
        phone: "8171687168",
        email: "manishupreti.4444@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech",
        areaOfInterest: "EDM, Optimization",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-manish-upreti/"
      },
      {
        name: "Mr. Rajesh Mehta",
        position: "Assistant Professor (STEF)",
        phone: "9997519826",
        email: "rajeshmehtagbpec@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech",
        areaOfInterest: "Thermal and Industrial Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-rajesh-mehta/"
      },
      {
        name: "Dr. Birendra Singh Karki",
        position: "Assistant Professor (STEF)",
        phone: "8750593967",
        email: "bskarki57@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "Ph.D",
        areaOfInterest: "KOM, TOM, DOM, Materials Science, Fracture Mechanics, Design",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-birendra-singh-karki/"
      },
      {
        name: "Mr. Himanshu Sah",
        position: "Assistant Professor (STEF)",
        phone: "7895128856",
        email: "himanshusah0506@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech (Thermal Engineering)",
        areaOfInterest: "Heat Transfer and Fluid Flow",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-himanshu-sah/"
      },
      {
        name: "Mr. Siddhartha Kumar",
        position: "Assistant Professor (STEF)",
        phone: "8077754021",
        email: "sidharthkumar.phd19@nitik.ac.in",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech (CAD, CAM)",
        areaOfInterest: "Design and Automation",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-siddhartha-kumar/"
      },
      {
        name: "Mr. Kapil Mohan",
        position: "Assistant Professor (STEF)",
        phone: "8840708903",
        email: "kapilmohan.iitd@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech (Industrial Tribology)",
        areaOfInterest: "Industrial Tribology, Lubrication, Design",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-kapil-mohan/"
      },
      {
        name: "Mr. Pankaj Rawat",
        position: "Assistant Professor (STEF)",
        phone: "9897258670",
        email: "pankaj08.pr@gmail.com",
        department: "Mechanical Engineering",
        departmentShort: "ME",
        qualification: "M.Tech (Production Engineering)",
        areaOfInterest: "Material Characterization, Composite Materials",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-pankaj-rawat/"
      }
    ]
  },
  {
    name: "Electronics & Communication Engineering",
    shortName: "ECE",
    members: [
      {
        name: "Dr. Rakesh Kumar Singh",
        position: "Professor",
        phone: "9412050954",
        email: "rksingkec12@rediffmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "Ph.D. in Electronics Engineering",
        areaOfInterest: "Electronics Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-rakesh-kumar-singh/"
      },
      {
        name: "Mr. Lalit Garia",
        position: "Assistant Professor",
        phone: "9410300303",
        email: "lalit.s.garia@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "M.Tech, PhD(Pursuing)",
        areaOfInterest: "Signal Processing, Image Processing, Communication System",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-lalit-garia/"
      },
      {
        name: "Mrs. Rachna Arya",
        position: "Assistant Professor & Head (ECE)",
        phone: "9837193999",
        email: "rachna009@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "M.Tech, PhD(Pursuing)",
        areaOfInterest: "Analog and Mixed Signal Design",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-rachna-arya/"
      },
      {
        name: "Mr. Ravindra Pratap Singh",
        position: "Assistant Professor",
        phone: "9456663968",
        email: "Singh.kec.2010@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "M.Tech",
        areaOfInterest: "Wireless Communication, Signal Processing, Image Processing",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-ravindra-pratap-singh/"
      },
      {
        name: "Dr. Parul Kansal",
        position: "Assistant Professor",
        phone: "9457047862",
        email: "kansal.parul@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "PhD, M.Tech",
        areaOfInterest: "Wireless Sensor Network, Communication",
        profileUrl: "https://kecua.ac.in/index.php/member/ms-parul-kansal/"
      },
      {
        name: "Mr. Varun Kakar",
        position: "Assistant Professor",
        phone: "9917088834",
        email: "kakarvarun@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "M.Tech, PhD(Pursuing)",
        areaOfInterest: "Semiconductor Devices, Device Modelling, Signal Processing",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-varun-kakar/"
      },
      {
        name: "Mr. R.P. Joshi",
        position: "Assistant Professor (On-Contract)",
        phone: "9027944897",
        email: "rajeshbt.2006@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "M.Tech",
        areaOfInterest: "Communication",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-r-p-joshi/"
      },
      {
        name: "Mr. Jaspreet Singh",
        position: "Assistant Professor (Guest Faculty)",
        phone: "8295804400",
        email: "er.jaspreetsingh15@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "ME(ECE), B.Tech(ECE)",
        areaOfInterest: "Optical Fibre Communication, Solitons",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-jaspreet-singh/"
      },
      {
        name: "Mr. Sanjay Singh",
        position: "Assistant Professor (STEF)",
        phone: "9012666583",
        email: "sanjayjaspur10@gmail.com",
        department: "Electronics & Communication Engineering",
        departmentShort: "ECE",
        qualification: "M.Tech (D.Comm)",
        areaOfInterest: "Electronics, Digital Electronics, Antenna, Communication",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-sanjay-singh/"
      }
    ]
  },
  {
    name: "Electrical Engineering",
    shortName: "EE",
    members: [
      {
        name: "Dr. Vijya Bhandari",
        position: "Assistant Professor & Head (EE)",
        phone: "7500635988",
        email: "viji27.gbpec@gmail.com",
        department: "Electrical Engineering",
        departmentShort: "EE",
        qualification: "PhD, M.Tech",
        areaOfInterest: "Image Processing, Optical Communication",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-vijya-bhandari/"
      },
      {
        name: "Mrs. Mamta Arya",
        position: "Assistant Professor (On-Contract)",
        phone: "8958497275",
        email: "mamta.arg2018@gmail.com",
        department: "Electrical Engineering",
        departmentShort: "EE",
        qualification: "M.Tech",
        areaOfInterest: "Control & Instrumentation",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-mamta-arya/"
      },
      {
        name: "Mr. Pramod Kumar Pandey",
        position: "Assistant Professor (STEF)",
        phone: "6395816665",
        email: "pandeypkiet57@gmail.com",
        department: "Electrical Engineering",
        departmentShort: "EE",
        qualification: "M. Tech. (Power Systems)",
        areaOfInterest: "Power System, Control System, Electrical Machine",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-pramod-kumar-pandey/"
      },
      {
        name: "Dr. Kanchan Matiyali",
        position: "Assistant Professor (STEF)",
        phone: "8954558325",
        email: "kmatiyali@gmail.com",
        department: "Electrical Engineering",
        departmentShort: "EE",
        qualification: "Ph.D.",
        areaOfInterest: "Power Electronics, Renewable Energy, Control System",
        profileUrl: "https://kecua.ac.in/index.php/member/kanchan-matiyali/"
      },
      {
        name: "Mr. Kamal Pandey",
        position: "Assistant Professor (STEF)",
        phone: "8449118614",
        email: "kamalpitg@gmail.com",
        department: "Electrical Engineering",
        departmentShort: "EE",
        qualification: "M.Tech (GBPUA&T Pantnagar)",
        areaOfInterest: "Power System, Power Electronics",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-kamal-pandey/"
      }
    ]
  },
  {
    name: "Civil Engineering",
    shortName: "CE",
    members: [
      {
        name: "Mrs. Renu Sinha",
        position: "Associate Professor",
        phone: "9412928242",
        email: "renu.renust01@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "B.Tech (Civil), M.Tech (Structural Engineering)",
        areaOfInterest: "Concrete, Building Materials, Transportation, Hydrology",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-renu-sinha/"
      },
      {
        name: "Mr. Neeraj Kumar",
        position: "Assistant Professor (On-Contract)",
        phone: "8057833725",
        email: "neerajcivil2008@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "M.Tech, PhD (Pursuing UTU)",
        areaOfInterest: "Concrete Bridge, Pre-Stressed Concrete Bridge, RCC Design",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-neeraj-kumar/"
      },
      {
        name: "Mr. Mintoo Kumar Gautam",
        position: "Assistant Professor (STEF)",
        phone: "9540129081",
        email: "kumar200829@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "M.Tech IIT BHU Varanasi",
        areaOfInterest: "Hydraulic and Water Resource Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-mintoo-kumar-gautam/"
      },
      {
        name: "Mr. Ashish Kumar",
        position: "Assistant Professor (STEF)",
        phone: "7088836055",
        email: "kumaronweb10@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "M. Tech",
        areaOfInterest: "Structural Dynamics",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-ashish-kumar/"
      },
      {
        name: "Ms. Priyanka Bora",
        position: "Assistant Professor (STEF)",
        phone: "6396622479",
        email: "priyankaborarkt@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "M.Tech. (Geotechnical Engineering)",
        areaOfInterest: "Slope Stability Analysis, Ground Improvement, Foundation Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/ms-priyanka-bora/"
      },
      {
        name: "Mr. Bhanu Pratap Singh Negi",
        position: "Assistant Professor (STEF)",
        phone: "8439269173",
        email: "negi.bhanu555@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "M.Tech",
        areaOfInterest: "Infrastructure Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-bhanu-pratap-singh-negi/"
      },
      {
        name: "Tabassum Faruki",
        position: "Assistant Professor (STEF)",
        phone: "8650642772",
        email: "tabbie18faruki@gmail.com",
        department: "Civil Engineering",
        departmentShort: "CE",
        qualification: "M.Tech Structural Engineering",
        areaOfInterest: "Structural Analysis, Steel Structure Design, Earthquake Engineering",
        profileUrl: "https://kecua.ac.in/index.php/member/tabassum-faruki/"
      }
    ]
  },
  {
    name: "Biochemical Engineering",
    shortName: "BCE",
    members: [
      {
        name: "Dr. Shweta Rawat",
        position: "Assistant Professor & Head",
        department: "Biochemical Engineering",
        departmentShort: "BCE",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-shweta-rawat/"
      },
      {
        name: "Dr. Vandana Singh",
        position: "Assistant Professor (STEF)",
        department: "Biochemical Engineering",
        departmentShort: "BCE",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-vandana-singh/"
      },
      {
        name: "Mr. Amit Mohan",
        position: "Assistant Professor",
        department: "Biochemical Engineering",
        departmentShort: "BCE",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-amit-mohan/"
      },
      {
        name: "Mr. Pankaj Sanwal",
        position: "Assistant Professor",
        department: "Biochemical Engineering",
        departmentShort: "BCE",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-pankaj-sanwal/"
      },
      {
        name: "Mr. Mayank",
        position: "Assistant Professor",
        department: "Biochemical Engineering",
        departmentShort: "BCE",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-mayank/"
      },
      {
        name: "Mrs. Shakti Katiyar",
        position: "Assistant Professor",
        department: "Biochemical Engineering",
        departmentShort: "BCE",
        profileUrl: "https://kecua.ac.in/index.php/member/mrs-shakti-katiyar/"
      }
    ]
  },
  {
    name: "Chemical Engineering",
    shortName: "CHE",
    members: [
      {
        name: "Dr. Anshuman Mishra",
        position: "Assistant Professor & Head",
        phone: "8954039941",
        email: "anshubiet1@gmail.com",
        department: "Chemical Engineering",
        departmentShort: "CHE",
        qualification: "B.Tech Chemical Engg., M.Tech IIT Bombay, PhD AKTU",
        areaOfInterest: "Waste Water Treatment, Bioremediation, Catalysis",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-anshuman-mishra/"
      },
      {
        name: "Mr. Vaibhav Rai",
        position: "Assistant Professor (On-Contract)",
        phone: "8171652570",
        email: "er.vaibhavrai@gmail.com",
        department: "Chemical Engineering",
        departmentShort: "CHE",
        qualification: "MTech",
        areaOfInterest: "Nanotechnology, Non Conventional Energy Sources, Fuel Cell",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-vaibhav-rai/"
      },
      {
        name: "Dr. Himanshu Tiwari",
        position: "Assistant Professor (Guest Faculty)",
        phone: "8126399576",
        email: "himanshutiwari883@gmail.com",
        department: "Chemical Engineering",
        departmentShort: "CHE",
        qualification: "Ph.D.",
        areaOfInterest: "Advanced Oxidation Techniques, Biological Wastewater Treatment",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-himanshu-tiwari/"
      },
      {
        name: "Mr. Ravi Saini",
        position: "Assistant Professor (Guest Faculty)",
        phone: "8941077836",
        email: "ravisaini.rs.che19@itbhu.ac.in",
        department: "Chemical Engineering",
        departmentShort: "CHE",
        qualification: "MTech, PhD",
        areaOfInterest: "Industrial Wastewater Treatment, Photocatalysis, Biofuel Production",
        profileUrl: "https://kecua.ac.in/index.php/member/mr-ravi-saini/"
      },
      {
        name: "Ms. Gulnaz Saifi",
        position: "Assistant Professor (STEF)",
        phone: "9639107881",
        email: "Gulnazsaifi19@gmail.com",
        department: "Chemical Engineering",
        departmentShort: "CHE",
        qualification: "M.Tech (Process Modelling & Simulation)",
        areaOfInterest: "Distillation, Heat Exchanger Design, Nanotechnology",
        profileUrl: "https://kecua.ac.in/index.php/member/ms-gulnaz-saifi/"
      }
    ]
  },
  {
    name: "Applied Science Department",
    shortName: "ASD",
    members: [
      {
        name: "Dr. Lata Bisht",
        position: "Professor & Head",
        phone: "9410919190",
        email: "dr.latabisht@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.Sc., Ph.D. (Maths)",
        areaOfInterest: "Differentiable Manifold",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-lata-bisht/"
      },
      {
        name: "Dr. Kuldeep Kholiya",
        position: "Assistant Professor",
        phone: "7895563339",
        email: "Kuldeep_phy1@rediffmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.Sc., Ph.D. (Physics)",
        areaOfInterest: "Condensed Matter Theory, Nanomaterials",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-kuldeep-kholiya/"
      },
      {
        name: "Dr. Rajesh Kumar Pandey",
        position: "Assistant Professor",
        phone: "9451204291",
        email: "pandey.rajesh69@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "MA, Ph.D. (English)",
        areaOfInterest: "British Poetry",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-rajesh-kumar-pandey/"
      },
      {
        name: "Dr. Jyoti Pandey Tripathi",
        position: "Assistant Professor (On-Contract)",
        phone: "9997456306",
        email: "jyoti.pandey16@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.Sc, Ph.D.",
        areaOfInterest: "Organic Chemistry",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-jyoti-pandey-tripathi/"
      },
      {
        name: "Dr. Bhawana Sanwal",
        position: "Assistant Professor (On-Contract)",
        phone: "9412128785",
        email: "bhawnakhulbey@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.Sc, Ph.D.",
        areaOfInterest: "Spectroscopy",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-bhawana-sanwal/"
      },
      {
        name: "Dr. Ruby Rani",
        position: "Assistant Professor (On-Contract)",
        phone: "08171796962",
        email: "ruby.aditya82@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.Phil and Ph.D. (English)",
        areaOfInterest: "Modern British Fiction",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-ruby-rani/"
      },
      {
        name: "Ms. Renu Bisht",
        position: "Assistant Professor (Guest Faculty)",
        phone: "7827176212",
        email: "renu.altezzasys@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.B.A",
        areaOfInterest: "Management",
        profileUrl: "https://kecua.ac.in/index.php/member/ms-renu-bisht/"
      },
      {
        name: "Mr. Neeraj Pant",
        position: "Assistant Professor (Guest Faculty)",
        phone: "9760948674",
        email: "npant4@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "MBA in Marketing and Hospitality",
        areaOfInterest: "Digital Marketing, Emerging Technologies",
        profileUrl: "https://kecua.ac.in/index.php/member/neeraj-pant/"
      },
      {
        name: "Ms. Neetu Rawat",
        position: "Assistant Professor (Guest Faculty)",
        phone: "7409780251",
        email: "neeturawatnr369@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "CSIR NET, GATE",
        areaOfInterest: "Linear Algebra",
        profileUrl: "https://kecua.ac.in/index.php/member/ms-neetu-rawat/"
      },
      {
        name: "Dr. Vivek Mainali",
        position: "Assistant Professor (STEF)",
        phone: "8171647290",
        email: "mainalivivek7@gmail.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "PhD(Mathematics), M.Sc(Mathematics)",
        areaOfInterest: "Fixed Point Theory",
        profileUrl: "https://kecua.ac.in/index.php/member/vivek-mainali/"
      },
      {
        name: "Dr. Narendra Biswas",
        position: "Assistant Professor (STEF)",
        phone: "9917733331",
        email: "narendrabiswas@yahoo.com",
        department: "Applied Science Department",
        departmentShort: "ASD",
        qualification: "M.Sc., CSIR NET JRF, GATE, PhD",
        areaOfInterest: "Frame Theory",
        profileUrl: "https://kecua.ac.in/index.php/member/dr-narendra-biswas/"
      }
    ]
  }
];

// Helper to get total faculty count
export function getTotalFacultyCount(): number {
  return departments.reduce((sum, dept) => sum + dept.members.length, 0);
}

// Helper to get all faculty as flat array
export function getAllFaculty(): FacultyMember[] {
  return departments.flatMap(dept => dept.members);
}

// Department color mapping for visual styling
export const departmentColors: Record<string, string> = {
  CSE: "#7B61FF",
  ME: "#FF6B6B",
  ECE: "#4ECDC4",
  EE: "#FFB347",
  CE: "#87CEEB",
  BCE: "#98D8C8",
  CHE: "#F7DC6F",
  ASD: "#C39BD3",
};
