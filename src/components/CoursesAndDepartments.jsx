import React from 'react'

const departments = ["","CECT", "CONAMS", "CBA", "CHTM", "CAS", "CoEd", "CCJE", "Medicine", "JWSLG", "High School", "Elementary"];
let courses = [""];
let department="";

if (department == "CECT"){
    courses = ["","Bachelor of Science in Information Technology", "Bachelor of Science in Electronics Engineering", "Bachelor of Science in Computer Engineering"];
}else if (department == "CONAMS"){
    courses = ["","Bachelor of Science in Nursing", "Bachelor of Science in Radiologic Technology", "Bachelor of Science in Medical Technology", "Bachelor of Science in Physical Therapy", "Bachelor of Science in Pharmacy"];
}else if (department == "CHTM"){
    courses = ["","Bachelor of Science in Hospitality Management major in Culinary and Kitchen Operations", "Bachelor of Science in Hospitality Management major in Hotel and Restaurant Administration", "Bachelor of Science in Tourism Management"];
}else if (department == "CBA"){
    courses = ["","Bachelor of Science in Accountancy", "Bachelor of Science in Accounting Technology", "Bachelor of Science in Business Administration"];
}else if (department == "CAS"){
    courses = ["","Bachelor of Arts in Communication ", "Bachelor of Arts in Political Science", "Bachelor of Arts in Psychology", "Bachelor of Arts in Theology", "Bachelor of Science in Psychology", "Bachelor of Science in Biology", "Bachelor of Science in Social Work"];
}else if (department == "CoEd"){
    courses = ["","Bachelor of Elementary Education", "Bachelor of Physical Education"];
}else if (department == "CCJE"){
    courses = ["","Bachelor of Science in Criminology"];
}else if (department == "Medicine"){
    courses = ["",""];
}else if (department == "JWSLG"){
    courses = ["",""];
}else if (department == "High School"){
    courses = ["","Junior High School", "Senior High School"];
}else if (department == "Elementary"){
    courses = ["","GRADE 1 to 3 ( Primary Level )", "GRADE 4 to 6 ( Intermediate Level )"];
}else{
    courses = [""];
}

export const dept_options = departments.map((dept) =>{
    <option key={dept}>{dept}</option>
});

export const course_options = courses.map((course) =>
<option key={course}>{course}</option>
);