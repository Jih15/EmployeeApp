$('#karyawan').change(function() {
    var karyawanId = $(this).val();
    $.ajax({
        url: '/get-gaji/' + karyawanId,
        type: 'GET',
        success: function(response) {
            $('#gaji_pokok').val(response.gaji_pokok);
        }
    });
});
