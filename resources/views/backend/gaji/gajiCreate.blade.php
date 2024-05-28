<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Gaji</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/gaji" novalidate="novalidate">
            @csrf
            <div class="form-group">
                <label for="karyawan" class="col-form-label">Karyawan</label>
                <select class="form-select form-select-md" id="karyawan" name="id_karyawan">
                    <option value="">Pilih karyawan</option>
                    @foreach ($karyawans as $kry)
                        <option value="{{ $kry->id_karyawan }}">{{ $kry->nama_depan }} {{$kry->nama_belakang}}</option>
                    @endforeach
                </select>
            </div>

            {{-- <div class="form-group">
                <label for="gaji_pokok" class="col-form-label">Gaji Pokok</label>
                <input type="text" class="form-control @error('gaji_pokok') is-invalid @enderror"
                    value="{{ old('gaji_pokok') }}" id="gaji_pokok" placeholder="Masukkan Nilai" name="gaji_pokok">
                @error('gaji_pokok')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div> --}}

            <div class="form-group">
                <label for="gaji_pokok" class="col-form-label">Gaji Pokok</label>
                <input type="text" class="form-control @error('gaji_pokok') is-invalid @enderror"
                    id="gaji_pokok" placeholder="Masukkan Nilai" name="gaji_pokok">
                @error('gaji_pokok')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="tanggal_penggajian" class="col-form-label">Tanggal Penggajian</label>
                <input type="date" class="form-control @error('tanggal_penggajian') is-invalid @enderror"
                    value="{{ old('tanggal_penggajian') }}" id="tanggal_penggajian" placeholder="Tahun Evaluasi" name="tanggal_penggajian">
                @error('tanggal_penggajian')
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
