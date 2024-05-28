<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Pelatihan Baru</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/pelatihan" novalidate="novalidate">
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
                <label for="nama_pelatihan" class="col-form-label">Nama Pelatihan</label>
                <input type="text" class="form-control @error('nama_pelatihan') is-invalid @enderror"
                    value="{{ old('nama_pelatihan') }}" id="nama_pelatihan" placeholder="Nama Pelatihan" name="nama_pelatihan">
                @error('nama_pelatihan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="tgl_pelatihan" class="col-form-label">Tanggal Pelatihan</label>
                <input type="date" class="form-control @error('tgl_pelatihan') is-invalid @enderror"
                    value="{{ old('tgl_pelatihan') }}" id="tgl_pelatihan" placeholder="Tanggal Masuk" name="tgl_pelatihan">
                @error('tgl_pelatihan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="lokasi_pelatihan" class="col-form-label">Lokasi Pelatihan</label>
                <input type="text" class="form-control @error('lokasi_pelatihan') is-invalid @enderror"
                    value="{{ old('lokasi_pelatihan') }}" id="lokasi_pelatihan" placeholder="Lokasi Pelatihan" name="lokasi_pelatihan">
                @error('lokasi_pelatihan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="lama_pelatihan" class="col-form-label">Lama Pelatihan</label>
                <input type="text" class="form-control @error('lama_pelatihan') is-invalid @enderror"
                    value="{{ old('lama_pelatihan') }}" id="lama_pelatihan" placeholder="Lokasi Pelatihan" name="lama_pelatihan">
                @error('lama_pelatihan')
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
