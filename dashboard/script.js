document.getElementById('month-select').addEventListener('change', function() {
    const selectedMonth = this.value;

    const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };

    let previousMonth = (parseInt(selectedMonth) - 1).toString().padStart(2, '0');
    let previousYear = '2025';

    if (selectedMonth === '01') {
        previousMonth = '12';
        previousYear = '2024';
    }

    const fileNameCurrent = `safe_folder/accidents_${selectedMonth}2025.json`;
    const fileNamePrevious = `safe_folder/accidents_${previousMonth}${previousYear}.json`;

    document.getElementById('total-incidents').textContent = '';
    document.getElementById('ltifr').textContent = '';
    document.getElementById('near-misses').textContent = '';
    document.getElementById('trainings').textContent = '';

    const incidentTrendCtx = document.getElementById('incident-trend').getContext('2d');
    const categoryHistogramCtx = document.getElementById('category-histogram').getContext('2d');
    const groupedBarChartCtx = document.getElementById('grouped-bar-chart').getContext('2d');
    if (window.incidentTrendChart) window.incidentTrendChart.destroy();
    if (window.categoryHistogramChart) window.categoryHistogramChart.destroy();
    if (window.groupedBarChart) window.groupedBarChart.destroy();

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    const fetchData = async () => {
        try {
            const currentResponse = await fetch(fileNameCurrent);
            if (!currentResponse.ok) throw new Error(`Error fetching current month data: ${currentResponse.statusText}`);
            const currentData = await currentResponse.json();

            if (!currentData) {
                alert('No data available for the selected month.');
                return;
            }

            document.getElementById('total-incidents').textContent = currentData.summary.total_incidents;
            document.getElementById('ltifr').textContent = currentData.summary.ltifr;
            document.getElementById('near-misses').textContent = currentData.summary.near_miss_reports;
            document.getElementById('trainings').textContent = currentData.summary.safety_trainings_conducted;

            const labels = currentData.incident_trend.map(item => `Day ${item.day}`);
            const counts = currentData.incident_trend.map(item => item.incidents);
            window.incidentTrendChart = new Chart(incidentTrendCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Incidents Over Days',
                        data: counts,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            const categoryCountsCurrent = {};
            currentData.incident_reports.forEach(report => {
                const category = report.category;
                categoryCountsCurrent[category] = (categoryCountsCurrent[category] || 0) + 1;
            });

            const categoryLabelsCurrent = Object.keys(categoryCountsCurrent);
            const currentMonthCounts = Object.values(categoryCountsCurrent);

            window.categoryHistogramChart = new Chart(categoryHistogramCtx, {
                type: 'bar',
                data: {
                    labels: categoryLabelsCurrent,
                    datasets: [{
                        label: `Incidents in ${monthNames[selectedMonth]} 2025`,
                        data: currentMonthCounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            let previousMonthCountsMap = {};
            let previousMonthLabel = `No Data for ${monthNames[previousMonth]} ${previousYear}`;

            if (previousMonth && parseInt(previousMonth) > 0) {
                const previousResponse = await fetch(fileNamePrevious);
                if (previousResponse.ok) {
                    const previousData = await previousResponse.json();
                    previousData.incident_reports.forEach(report => {
                        const category = report.category;
                        previousMonthCountsMap[category] = (previousMonthCountsMap[category] || 0) + 1;
                    });
                    previousMonthLabel = `Incidents in ${monthNames[previousMonth]} ${previousYear}`;
                }
            }

            // Combine all unique categories from both months
            const allCategories = Array.from(new Set([
                ...Object.keys(categoryCountsCurrent),
                ...Object.keys(previousMonthCountsMap)
            ]));

            const completeCurrentCounts = allCategories.map(cat => categoryCountsCurrent[cat] || 0);
            const completePreviousCounts = allCategories.map(cat => previousMonthCountsMap[cat] || 0);

            window.groupedBarChart = new Chart(groupedBarChartCtx, {
                type: 'bar',
                data: {
                    labels: allCategories,
                    datasets: [{
                        label: `Incidents in ${monthNames[selectedMonth]} 2025`,
                        data: completeCurrentCounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }, {
                        label: previousMonthLabel,
                        data: completePreviousCounts,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { categoryPercentage: 0.5 },
                        y: { beginAtZero: true }
                    }
                }
            });

            tbody.innerHTML = '';
            currentData.incident_reports.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${report.date}</td>
                    <td>${report.incident_type}</td>
                    <td>${report.category}</td>
                    <td>${report.location}</td>
                    <td>${report.severity}</td>
                    <td>${report.status}</td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            alert(`Error loading data: ${error.message}`);
        }
    };

    fetchData();
});
