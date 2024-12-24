document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonth = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const dayModal = document.getElementById('day-modal');
    const closeModal = document.getElementById('close-modal');
    const dayOptions = document.getElementById('day-options');
    const viewDetailsBtn = document.getElementById('view-details');
    const addDetailsBtn = document.getElementById('add-details');
    const dayDetailsForm = document.getElementById('day-details-form');
    const allDayCheckbox = document.getElementById('all-day');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const activityInput = document.getElementById('activity');
    const dayInfo = document.getElementById('day-info');

    let selectedDay = null;
    let currentDate = new Date();

    // Recuperar actividades guardadas del almacenamiento local
    const activities = JSON.parse(localStorage.getItem('activities')) || {};

    const saveActivitiesToLocalStorage = () => {
        localStorage.setItem('activities', JSON.stringify(activities));
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        currentMonth.textContent = `${currentDate.toLocaleString('es-ES', { month: 'long' })} ${year}`;
        calendarDays.innerHTML = '';

        // Rellenar con días del mes
        for (let i = 0; i < firstDay; i++) {
            calendarDays.innerHTML += '<div></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = day;

            // Si el día tiene actividades
            if (activities[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`]) {
                dayDiv.classList.add('busy');
                const activity = activities[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`];

                // Verificar si la actividad es "Todo el día"
                let spriteUrl = '';
                if (activity[0].allDay) {
                    spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'; // URL de la Pokébola
                } else {
                    spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'; // Charmander
                }

                const pokeImage = document.createElement('img');
                pokeImage.src = spriteUrl;
                pokeImage.alt = 'Pokébola o Charmander';
                pokeImage.style.width = '40px'; // Tamaño más grande
                pokeImage.style.height = '40px'; // Tamaño más grande
                dayDiv.appendChild(pokeImage);
            }

            dayDiv.addEventListener('click', () => {
                selectedDay = day;
                dayModal.classList.remove('hidden');
                toggleDayOptions();
            });

            calendarDays.appendChild(dayDiv);
        }
    };

    const toggleDayOptions = () => {
        const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
        const hasActivities = !!activities[dayKey];
        dayOptions.classList.toggle('hidden', !hasActivities);
        dayDetailsForm.classList.add('hidden');
        dayInfo.classList.add('hidden');

        if (hasActivities) {
            showDayInfo(dayKey);
        } else {
            dayDetailsForm.classList.remove('hidden');
        }
    };

    const showDayInfo = (dayKey) => {
        dayInfo.classList.remove('hidden');
        dayInfo.innerHTML = `<h4>Actividades para el día ${selectedDay}</h4>`;
        activities[dayKey].forEach((activity, index) => {
            dayInfo.innerHTML += `<p>${index + 1}. ${activity.allDay ? 'Todo el día' : `${activity.startTime} - ${activity.endTime}`}: ${activity.description}</p>`;
        });
    };

    const saveDayDetails = (event) => {
        event.preventDefault();

        const allDay = allDayCheckbox.checked;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const activity = activityInput.value;

        if (!allDay && (!startTime || !endTime || !activity)) {
            alert('Completa todos los campos correctamente.');
            return;
        }

        const activityData = {
            allDay,
            startTime: allDay ? null : startTime,
            endTime: allDay ? null : endTime,
            description: activity,
        };

        const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;

        if (!activities[dayKey]) {
            activities[dayKey] = [];
        }
        activities[dayKey].push(activityData);

        saveActivitiesToLocalStorage();

        dayModal.classList.add('hidden');
        dayDetailsForm.reset();
        renderCalendar();
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    closeModal.addEventListener('click', () => {
        dayModal.classList.add('hidden');
    });

    viewDetailsBtn.addEventListener('click', () => {
        const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
        dayInfo.classList.remove('hidden');
        dayDetailsForm.classList.add('hidden');
        showDayInfo(dayKey);
    });

    addDetailsBtn.addEventListener('click', () => {
        dayInfo.classList.add('hidden');
        dayDetailsForm.classList.remove('hidden');
    });

    // Reemplazar la función del botón "ver detalles" por "eliminar"
    viewDetailsBtn.textContent = "Eliminar";
    viewDetailsBtn.addEventListener("click", () => {
     const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
     if (activities[dayKey]) {
        if (confirm(`¿Estás seguro de que quieres eliminar todas las actividades para el día ${selectedDay}?`)) {
            delete activities[dayKey];
            saveActivitiesToLocalStorage();
            renderCalendar();
            dayModal.classList.add("hidden");
        }
    }
});


    dayDetailsForm.addEventListener('submit', saveDayDetails);

    renderCalendar();
});
