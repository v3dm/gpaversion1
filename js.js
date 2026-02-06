const curriculum = {
  "1-1": [
    { name: "Physics / Chemistry", credit: 4 },
    { name: "Mathematics 1", credit: 4 },
    { name: "EE / EC", credit: 3 },
    { name: "ME / PPS", credit: 3 },
    { name: "Soft Skills / EVS", credit: 3 },
    { name: "Physics / Chemistry Lab", credit: 1 },
    { name: "EE / EC Lab", credit: 1 },
    { name: "ENG / PPS Lab", credit: 1 },
    { name: "Engg Graphics / Workshop", credit: 2 }
  ],
  "1-2": [
    { name: "Physics / Chemistry", credit: 4 },
    { name: "Mathematics 2", credit: 4 },
    { name: "EE / EC", credit: 3 },
    { name: "ME / PPS", credit: 3 },
    { name: "Soft Skills / EVS", credit: 3 },
    { name: "Physics / Chemistry Lab", credit: 1 },
    { name: "EE / EC Lab", credit: 1 },
    { name: "ENG / PPS Lab", credit: 1 },
    { name: "Engg Graphics / Workshop", credit: 2 }
  ],
  "2-3": [
    { name: "Mathematics 4", credit: 4 },
    { name: "UHV", credit: 3 },
    { name: "Data Structures", credit: 4 },
    { name: "DSTL", credit: 3 },
    { name: "COA", credit: 4 },
    { name: "Python", credit: 2 },
    { name: "DS Lab", credit: 1 },
    { name: "COA Lab", credit: 1 },
    { name: "Web D Lab", credit: 1 },
    { name: "Internship Assessment", credit: 2 }
  ],
  "2-4": [
    { name: "ESE", credit: 4 },
    { name: "TC", credit: 3 },
    { name: "Operating Systems", credit: 4 },
    { name: "TAFL", credit: 4 },
    { name: "OOPS", credit: 3 },
    { name: "Cyber Security", credit: 2 },
    { name: "OS Lab", credit: 1 },
    { name: "OOPS Lab", credit: 1 },
    { name: "Cyber Security Lab", credit: 1 }
  ],
  "3-5": [
    { name: "DBMS", credit: 4 },
    { name: "DAA", credit: 4 },
    { name: "ASC", credit: 3 },
    { name: "DAV", credit: 4 },
    { name: "BIA", credit: 3 },
    { name: "COI", credit: 0 },
    { name: "DBMS Lab", credit: 1 },
    { name: "DAA Lab", credit: 1 },
    { name: "DAV Lab", credit: 1 },
    { name: "Internship Assessment", credit: 2 }
  ],
  "3-6": [
    { name: "Software Engineering", credit: 4 },
    { name: "Big Data and Analytics", credit: 4 },
    { name: "Computer Networks", credit: 4 },
    { name: "MLT", credit: 3 },
    { name: "Software Project Management", credit: 3 },
    { name: "Indian Tradition", credit: 0 },
    { name: "Software Engineering Lab", credit: 1 },
    { name: "Big Data and Analytics Lab", credit: 1 },
    { name: "Computer Networks Lab", credit: 1 }
  ]
};

function getGradeInfo(marks) {
    if (marks >= 90) return { point: 10, grade: "A+" };
    else if (marks >= 80) return { point: 9, grade: "A" };
    else if (marks >= 70) return { point: 8, grade: "B+" };
    else if (marks >= 60) return { point: 7, grade: "B" };
    else if (marks >= 50) return { point: 6, grade: "C" };
    else if (marks >= 45) return { point: 5, grade: "D" };
    else return { point: 0, grade: "F" };
}

function loadSubjects() {
    const year = document.getElementById("year").value;
    const sem = document.getElementById("sem").value;
    const key = `${year}-${sem}`;
    const form = document.getElementById("subjectsForm");
    const breakdown = document.getElementById("breakdown");
    const result = document.getElementById("result");

    form.innerHTML = "";
    result.innerText = "";
    breakdown.hidden = true;

    if (!curriculum[key]) {
        form.innerHTML = "<p style='text-align:center;'>No subjects found.</p>";
        return;
    }

    curriculum[key].forEach(sub => {
        form.innerHTML += `
            <div class="subject" data-name="${sub.name}" data-credit="${sub.credit}">
                <h3>${sub.name} (Credits: ${sub.credit})</h3>
                <div class="input-grid">
                    <input type="number" class="credit" value="${sub.credit}" hidden>
                    <input type="number" class="internal" placeholder="Internal Marks">
                    <input type="number" class="external" placeholder="External Marks">
                </div>
            </div>
        `;
    });
}

function calculateCGPA() {
    const credits = document.getElementsByClassName("credit");
    const internals = document.getElementsByClassName("internal");
    const externals = document.getElementsByClassName("external");
    const subjects = document.getElementsByClassName("subject");
    const breakdownBody = document.getElementById("breakdownBody");
    const breakdown = document.getElementById("breakdown");

    let totalCredits = 0;
    let totalPoints = 0;

    breakdownBody.innerHTML = "";

    for (let i = 0; i < credits.length; i++) {
        const credit = Number(credits[i].value);
        const internal = Number(internals[i].value);
        const external = Number(externals[i].value);

        if (isNaN(internal) || isNaN(external)) {
            alert(`Enter marks for subject ${i + 1}`);
            return;
        }

        const marks = internal + external;
        const info = getGradeInfo(marks);
        const points = info.point;
        totalCredits += credit;
        totalPoints += credit * points;

        const name = subjects[i].dataset.name;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${name}</td>
            <td>${credit}</td>
            <td>${marks}</td>
            <td>${info.grade}</td>
        `;
        breakdownBody.appendChild(row);
    }

    const cgpa = (totalPoints / totalCredits).toFixed(2);
    document.getElementById("result").innerText = `Final CGPA: ${cgpa}`;
    breakdown.hidden = false;
}

async function loadVisitCount() {
    const el = document.getElementById("visitNumber");
    if (!el) return;

    try {
        const res = await fetch("/api/visits", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load visits");
        const data = await res.json();
        el.textContent = Number.isFinite(data.count) ? data.count : "—";
    } catch (err) {
        el.textContent = "—";
    }
}

document.addEventListener("DOMContentLoaded", loadVisitCount);
