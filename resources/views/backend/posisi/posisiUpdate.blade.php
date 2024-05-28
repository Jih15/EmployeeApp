<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Edit Posisi</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">x</span>
        </button>
    </div>
    <div class="modal-body">
        <form id="updateFormPosisi" method="POST" action="/posisi/:id" novalidate="novalidate">
            @method('PUT')
            @csrf
            <div class="form-group">
                <input type="hidden" name="id_posisi" id="updatePosisiId" value="">
                <label for="id_department" class="col-form-label">Department</label>
                <select class="form-select form-select-md" id="update_id_department" name="id_department">
                    <option value="">Pilih Departemen</option>
                    @foreach ($departments as $dept)
                        <option value="{{ $dept->id_department }}">{{ $dept->nama_department }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label for="nama_posisi" class="col-form-label">Nama Posisi</label>
                <input type="text" class="form-control @error('nama_posisi') is-invalid @enderror"
                    id="update_nama_posisi" placeholder="Nama Posisi" name="nama_posisi">
            </div>

            <div class="form-group">
                <label for="gaji_pokok" class="col-form-label">Gaji Pokok</label>
                <input type="text" class="form-control @error('gaji_pokok') is-invalid @enderror"
                    value="{{ old('gaji_pokok') }}" id="update_gaji_pokok" placeholder="Masukkan Gaji Pokok"
                    name="gaji_pokok">
                @error('gaji_pokok')
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
