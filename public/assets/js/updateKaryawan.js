document.addEventListener('DOMContentLoaded', function () {
    const updateButtons = document.querySelectorAll('.update-karyawan-btn');
    updateButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const karyawanId = this.getAttribute('data-id');
            const form = document.getElementById('updateKaryawanForm');
            const actionUrl = form.getAttribute('action').replace(':id', karyawanId);
            form.setAttribute('action', actionUrl);
            document.getElementById('updateKaryawanId').value = karyawanId;

            form.reset();

            fetch(`/karyawan/${karyawanId}/edit`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    form.querySelector('select[name="cur_id_user"]').value = data.id_user;
                    form.querySelector('input[name="cur_nama_depan"]').value = data.nama_depan;
                    form.querySelector('input[name="cur_nama_belakang"]').value = data.nama_belakang;
                    form.querySelector('select[name="cur_id_posisi"]').value = data.id_posisi;
                    form.querySelector('select[name="cur_id_manager"]').value = data.id_manager;
                    form.querySelector('select[name="cur_jenis_kelamin"]').value = data.jenis_kelamin;
                    form.querySelector('input[name="cur_tgl_lahir"]').value = data.tgl_lahir;
                    form.querySelector('textarea[name="cur_alamat"]').value = data.alamat;
                    form.querySelector('input[name="cur_no_telp"]').value = data.no_telp;
                    form.querySelector('input[name="cur_email"]').value = data.email;
                    form.querySelector('input[name="cur_foto"]').value = data.foto;
                    form.querySelector('input[name="cur_tgl_masuk"]').value = data.tgl_masuk;
                })
                .catch(error => console.error('Error fetching or processing karyawan data:', error));
        });
    });
});
