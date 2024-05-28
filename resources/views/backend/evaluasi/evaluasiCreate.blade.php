<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Hasil Evaluasi</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/evaluasi" novalidate="novalidate">
            @csrf
            <div class="form-group">
                <label for="karyawan" class="col-form-label">Karyawan</label>
                <select class="form-select form-select-md" id="karyawan" name="id_karyawan">
                    <option value="">Pilih karyawan</option>
                    @foreach ($karyawans as $kry)
                        <option value="{{ $kry->id_karyawan }}">{{ $kry->nama_depan }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="tahun_evaluasi" class="col-form-label">Tahun Evaluasi</label>
                <input type="date" class="form-control @error('tahun_evaluasi') is-invalid @enderror"
                    value="{{ old('tahun_evaluasi') }}" id="tahun_evaluasi" placeholder="Tahun Evaluasi" name="tahun_evaluasi">
                @error('tahun_evaluasi')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="penilaian_kinerja" class="col-form-label">Penilaian Kinerja</label>
                <input type="text" class="form-control @error('penilaian_kinerja') is-invalid @enderror"
                    value="{{ old('penilaian_kinerja') }}" id="penilaian_kinerja" placeholder="Masukkan Nilai" name="penilaian_kinerja">
                @error('penilaian_kinerja')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="message-text" class="col-form-label">Catatan</label>
                <textarea class="form-control @error('catatan') is-invalid @enderror" name="catatan" id="exampleTextarea1"
                    rows="4">{{ old('catatan') }}</textarea>
                @error('catatan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div>
                <button type="submit" class="btn btn-primary">Tambahkan</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>
    </div>
</div>

