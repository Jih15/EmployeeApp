document.addEventListener('DOMContentLoaded', function(){
    const updateButtons = document.querySelectorAll('.update-btn-evaluasi');
    updateButtons.forEach(function (button){
        button.addEventListener('click', function (){
            const evaluasiId = this.getAttribute('data-id');
            const form = document.getElementById('updateEvaluasiForm');
            const actionUrl = form.getAttribute('action').replace(':id', evaluasiId);
            form.setAttribute('action', actionUrl);
            document.getElementById('updateEvaluasiId').value = evaluasiId;

            fetch(`/evaluasi/${evaluasiId}/edit`)
                .then(response => {
                    if (!response.ok){
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    form.querySelector('select[name="id_karyawan"]').value = data.id_karyawan;
                    form.querySelector('input[name="tahun_evaluasi"]').value = data.tahun_evaluasi;
                    form.querySelector('input[name="penilaian_kinerja"]').value = data.penilaian_kinerja;
                    form.querySelector('textarea[name="catatan"]').value = data.catatan;
                })
                .catch(error => console.error('Error fetching evaluasi:', error));
        });
    });
});

