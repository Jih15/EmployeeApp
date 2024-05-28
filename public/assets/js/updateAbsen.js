document.addEventListener('DOMContentLoaded', function () {
    const updateButtons = document.querySelectorAll('.update-btn-absen');
    updateButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const absenId = this.getAttribute('data-id');
            const form = document.getElementById('updateFormAbsen');
            const actionUrl = form.getAttribute('action').replace(':id', absenId);
            form.setAttribute('action', actionUrl);
            document.getElementById('updateAbsenId').value = absenId;

            fetch(`/absen/${absenId}/edit`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Set value for karyawan
                    form.querySelector('select[name="cur_ab_id_karyawan"]').value = data.id_karyawan;

                    // Format tanggal
                    const formattedTglAbsen = data.tgl_absen.split(' ')[0];
                    form.querySelector('input[name="cur_tgl_absen"]').value = formattedTglAbsen;

                    // Set value for jam masuk dan jam keluar
                    form.querySelector('input[name="cur_jam_masuk"]').value = data.jam_masuk;
                    form.querySelector('input[name="cur_jam_keluar"]').value = data.jam_keluar;

                    // Set radio button based on status value
                    const statusRadios = form.querySelectorAll('input[name="cur_status"]');
                    statusRadios.forEach(radio => {
                        if (radio.value === data.status) {
                            radio.checked = true;
                        }
                    });
                })
                .catch(error => console.error('Error fetching absen:', error));
        });
    });
});
