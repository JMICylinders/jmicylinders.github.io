let currentData = [];

function onDepartmentChange() {
  const department = document.getElementById('departmentSelect').value;

  if (department) {
    fetch(`doc/hira_${department}.json`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load JSON');
        return response.json();
      })
      .then(data => {
        currentData = data.HIRA_Register;
        populateMachineDropdown();
        clearTablesAndImages();
      })
      .catch(error => {
        console.error('Error loading department data:', error);
        currentData = [];
        populateMachineDropdown();
      });
  } else {
    currentData = [];
    populateMachineDropdown();
    clearTablesAndImages();
  }
}

function populateMachineDropdown() {
  const machineSelect = document.getElementById('machineSelect');
  machineSelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.text = 'Select a Machine';
  defaultOption.value = '';
  machineSelect.appendChild(defaultOption);

  const machines = [...new Set(currentData.map(item => item.Machine))];
  machines.forEach(machine => {
    const option = document.createElement('option');
    option.value = machine;
    option.textContent = machine;
    machineSelect.appendChild(option);
  });
}

function updateData() {
  const selectedMachine = document.getElementById('machineSelect').value;
  const filtered = currentData.filter(item => item.Machine === selectedMachine);

  if (filtered.length > 0) {
    document.getElementById('machineImage').innerHTML = `<img src="images/quality/${selectedMachine}.jpg" alt="${selectedMachine}" width="300">`;
    document.getElementById('riskMatrixImage').innerHTML = `<img src="images/risk_matrix.jpg" alt="Risk Matrix" width="300">`;

    populateHiraTable(filtered);
    populateControlMeasuresTable(filtered);
  } else {
    clearTablesAndImages();
  }
}

function populateHiraTable(data) {
  const tbody = document.querySelector('#hazardTable tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.Machine}</td>
      <td>${row['Process']}</td>
      <td>${row['Specific Hazard']}</td>
      <td>${row['Perceived Risk']}</td>
      <td>${row['Severity']}</td>
      <td>${row['Likelihood']}</td>
      <td>${row['Risk Rating']}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populateControlMeasuresTable(data) {
  const tbody = document.querySelector('#controlMeasuresTable tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.Machine}</td>
      <td>${row['Perceived Risk']}</td>
      <td>${row['Required New Control']}</td>
      <td>${row['Responsibility']}</td>
      <td>${row['Time Frame']}</td>
      <td>${row['Severity (N)']}</td>
      <td>${row['Likelihood (N)']}</td>
      <td>${row['Risk']}</td>
    `;
    tbody.appendChild(tr);
  });
}

function clearTablesAndImages() {
  document.querySelector('#hazardTable tbody').innerHTML = '';
  document.querySelector('#controlMeasuresTable tbody').innerHTML = '';
  document.getElementById('machineImage').innerHTML = '';
  document.getElementById('riskMatrixImage').innerHTML = '';
}
