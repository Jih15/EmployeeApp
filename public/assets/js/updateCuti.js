document.addEventListener('DOMContentLoaded', function () {
    const updateButtons = document.querySelectorAll('.update-btn-cuti');
    updateButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const cutiId = this.getAttribute('data-id');
            const form = document.getElementById('updateFormCuti');
            const actionUrl = form.getAttribute('action').replace(':id', cutiId);
            form.setAttribute('action', actionUrl);
            document.getElementById('cutiId').value = cutiId;

            form.reset();

            fetch(`/cuti/${cutiId}/edit`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    form.querySelector('input[name="id_cuti"]').value = data.id_cuti;
                    form.querySelector('select[name="id_karyawan"]').value = data.id_karyawan;
                    form.querySelector('input[name="tgl_mulai"]').value = data.tgl_mulai;
                    form.querySelector('input[name="tgl_selesai"]').value = data.tgl_selesai;
                    form.querySelector('input[name="jenis_cuti"]').value = data.jenis_cuti;
                    form.querySelector(`input[name="status"][value="${data.status}"]`).checked = true;
                })
                .catch(error => console.error('Error fetching absen:', error));
        });
    });
});
