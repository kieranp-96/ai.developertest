// function used to fetch data from the server and render it to the html and can be called on adding, deleting and editing users.
const fetchUsers = async () => {
    const response = await fetch('http://localhost:5000/api/users');
    const users = await response.json();
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = '';

    // render the userlist to the html
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-3 px-4">${user.name}</td>
            <td class="py-3 px-4">${user.email}</td>
            <td class="py-3 px-4">${user.role}</td>
            <td class="py-3 px-4">
                <button onclick="editUser('${user.id}', '${user.name}', '${user.email}', '${user.role}')" class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                <button onclick="deleteUser('${user.id}')" class="text-red-500 hover:text-red-700">Delete</button>
            </td>
        `;
        userTable.appendChild(row);
    });
};

const addUser = async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
    });

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('role').value = '';
    fetchUsers();
};

// DELETE user fetch function
const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
};

// model 
const editUser = (id, name, email, role) => {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;
    document.getElementById('editModal').classList.remove('hidden');
    document.getElementById('editModal').classList.add('flex');
};

// save edit function
const saveEdit = async () => {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;

    await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
    });

    closeEditModal();
    // fetch users to make sure the changes are rendered
    fetchUsers();
};

// exit model function
const closeEditModal = () => {
    document.getElementById('editModal').classList.remove('flex');
    document.getElementById('editModal').classList.add('hidden');
};

// event listeners
document.getElementById('addUser').addEventListener('click', addUser);
document.getElementById('saveEdit').addEventListener('click', saveEdit);
document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
window.onload = fetchUsers;
