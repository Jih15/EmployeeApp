<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Ubah Data Evaluasi</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/evaluasi/:id" id="updateEvaluasiForm" novalidate="novalidate">
            @method('PUT')
            @csrf
            <div class="form-group">
                <input type="hidden" name="id_evaluasi" id="updateEvaluasiId">
                <label for="karyawan" class="col-form-label">Karyawan</label>
                <select class="form-select form-select-md" id="karyawan" name="id_karyawan">
                    <option value="">Pilih karyawan</option>
                    @foreach ($karyawans as $karyawan)
                        <option value="{{ $karyawan->id_karyawan }}">{{ $karyawan->nama_depan }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="tahun_evaluasi" class="col-form-label">Pilih Tahun Evaluasi</label>
                <input type="date" class="form-control @error('tahun_evaluasi') is-invalid @enderror"
                    id="tahun_evaluasi" name="tahun_evaluasi">
                @error('tahun_evaluasi')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="penilaian_kinerja" class="col-form-label">Penilaian Kinerja</label>
                <input type="text" class="form-control @error('penilaian_kinerja') is-invalid @enderror"
                    id="penilaian_kinerja" placeholder="Masukkan Nilai" name="penilaian_kinerja">
                @error('penilaian_kinerja')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="catatan" class="col-form-label">Catatan</label>
                <textarea class="form-control @error('catatan') is-invalid @enderror" name="catatan" id="catatan"
                    rows="4"></textarea>
                @error('catatan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div>
                <button type="submit" class="btn btn-primary">Ubah</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>

    </div>
</div>
