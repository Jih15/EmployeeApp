document.addEventListener('DOMContentLoaded', function () {
    const updateButtons = document.querySelectorAll('.update-department-btn');
    updateButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const departmentId = this.getAttribute('data-id');
            const form = document.getElementById('updateForm');
            const actionUrl = form.getAttribute('action').replace(':id', departmentId);
            form.setAttribute('action', actionUrl);
            document.getElementById('updateDepartmentId').value = departmentId;

            form.reset();

            fetch(`/department/${departmentId}/edit`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    form.querySelector('input[name="nama_department"]').value = data.nama_department;
                    form.querySelector('textarea[name="deskripsi"]').value = data.deskripsi;
                })
                .catch(error => console.error('Error fetching department:', error));
        });
    });
});
