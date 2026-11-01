fetch('/students-data')
    .then(res => res.json())
    .then(data => {
        let studentContainer = document.getElementById('studentContainer')
        let cards = data.map((student) => {
            return `
                <div class="student-card">
                    <h3>${student.name}</h3>
                    <p>Email: ${student.email}</p>
                    <p>Course: ${student.course}</p>
                </div>
            `
        })
        studentContainer.innerHTML = cards.join('')
    }).catch(err => console.log(err))