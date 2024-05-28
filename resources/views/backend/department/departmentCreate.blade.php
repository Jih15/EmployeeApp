<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Department Baru</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/department" novalidate="novalidate">
            @csrf
            <div class="form-group">
                <label for="recipient-name" class="col-form-label">Nama Department</label>
                <input type="text" class="form-control @error('nama_department') is-invalid @enderror"
                    value="{{ old('nama_department') }}" id="exampleInputName1" placeholder="Nama department"
                    name="nama_department">
            </div>
            <div class="form-group">
                <label for="message-text" class="col-form-label">Deskripsi</label>
                <textarea class="form-control @error('deskripsi') is-invalid @enderror" name="deskripsi" value="{{ old('deskripsi') }}"
                    id="exampleTextarea1" rows="4"></textarea>
            </div>
            <div>
                <button type="submit" class="btn btn-primary">Tambahkan</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>
    </div>
</div>
