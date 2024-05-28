document.addEventListener('DOMContentLoaded', function () {
    const updateButtons = document.querySelectorAll('.update-posisi-btn');
    updateButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const posisiId = this.getAttribute('data-id');
            const form = document.getElementById('updateFormPosisi');
            const actionUrl = form.getAttribute('action').replace(':id', posisiId);
            form.setAttribute('action', actionUrl);
            document.getElementById('updatePosisiId').value = posisiId;

            form.reset();

            fetch(`/posisi/${posisiId}/edit`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    form.querySelector('select[name="id_department"]').value = data.id_department;
                    form.querySelector('input[name="nama_posisi"]').value = data.nama_posisi;
                    form.querySelector('input[name="gaji_pokok"]').value = data.gaji_pokok;
                })
                .catch(error => console.error('Error fetching or processing posisi data:', error));
        });
    });
});
