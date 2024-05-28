<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Posisi Baru</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">x</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/posisi" novalidate="novalidate">
            @csrf
            <div class="form-group">
                <label for="department" class="col-form-label">Departement</label>
                <select class="form-select form-select-md" id="department" name="id_department">
                    <option value="">Pilih Departemen</option>
                    @foreach ($departments as $dept)
                        <option value="{{ $dept->id_department }}">{{ $dept->nama_department }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label for="nama_posisi" class="col-form-label">Nama Posisi</label>
                <input type="text" class="form-control @error('nama_posisi') is-invalid @enderror"
                    value="{{ old('nama_posisi') }}" id="nama_posisi" placeholder="Nama Posisi"
                    name="nama_posisi">
                @error('nama_posisi')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="gaji_pokok" class="col-form-label">Gaji Pokok</label>
                <input type="text" class="form-control @error('gaji_pokok') is-invalid @enderror"
                    value="{{ old('gaji_pokok') }}" id="gaji_pokok" placeholder="Masukkan Gaji Pokok"
                    name="gaji_pokok">
                @error('gaji_pokok')
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
