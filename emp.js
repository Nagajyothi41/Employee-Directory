let employees = []; // Local in-memory data
let editingId = null;

function showForm(id = null) {
  document.getElementById('formContainer').classList.remove('hidden');
  document.getElementById('formTitle').innerText = id ? 'Edit Employee' : 'Add Employee';

  if (id) {
    const emp = employees.find(e => e.id === id);
    document.getElementById('empId').value = emp.id;
    document.getElementById('firstName').value = emp.firstName;
    document.getElementById('lastName').value = emp.lastName;
    document.getElementById('email').value = emp.email;
    document.getElementById('department').value = emp.department;
    document.getElementById('role').value = emp.role;
    editingId = id;
  } else {
    document.getElementById('employeeForm').reset();
    editingId = null;
  }
}

function cancelForm() {
  document.getElementById('formContainer').classList.add('hidden');
  document.getElementById('employeeForm').reset();
}

function handleSubmit(event) {
  event.preventDefault();

  const emp = {
    id: editingId || Date.now(),
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    department: document.getElementById('department').value.trim(),
    role: document.getElementById('role').value.trim()
  };

  if (!validateEmail(emp.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (editingId) {
    const index = employees.findIndex(e => e.id === editingId);
    employees[index] = emp;
  } else {
    employees.push(emp);
  }

  renderEmployees();
  cancelForm();
}

function renderEmployees(data = employees) {
  const container = document.getElementById('employeeList');
  container.innerHTML = '';

  data.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <div class="button-group">
        <button onclick="editEmployee(${emp.id})">Edit</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function editEmployee(id) {
  showForm(id);
}

function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees = employees.filter(e => e.id !== id);
    renderEmployees();
  }
}

function applyFilters() {
  const first = document.getElementById('filterFirstName').value.toLowerCase();
  const dept = document.getElementById('filterDepartment').value.toLowerCase();
  const role = document.getElementById('filterRole').value.toLowerCase();

  const filtered = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(first) &&
    emp.department.toLowerCase().includes(dept) &&
    emp.role.toLowerCase().includes(role)
  );

  renderEmployees(filtered);
}

function clearFilters() {
  document.getElementById('filterFirstName').value = '';
  document.getElementById('filterDepartment').value = '';
  document.getElementById('filterRole').value = '';
  renderEmployees();
}

function paginate() {
  const size = parseInt(document.getElementById('pageSize').value);
  renderEmployees(employees.slice(0, size));
}

document.getElementById('searchInput').addEventListener('input', function () {
  const keyword = this.value.toLowerCase();
  const result = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(keyword) ||
    emp.lastName.toLowerCase().includes(keyword) ||
    emp.email.toLowerCase().includes(keyword)
  );
  renderEmployees(result);
});

document.getElementById('filterToggle').addEventListener('click', () => {
  document.getElementById('filterPanel').classList.toggle('hidden');
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Initial render (if you want sample data to test, you can add here)
renderEmployees();