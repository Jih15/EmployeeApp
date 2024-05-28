<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Update Department</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">x</span>
        </button>
    </div>
    <div class="modal-body">
        <form id="updateForm" method="POST" action="/department/:id" novalidate="novalidate">
            @method('PUT')
            @csrf
            <div class="form-group">
                <input type="hidden" name="id_department" id="updateDepartmentId" value="">
                <label for="exampleInputName1" class="col-form-label">Nama Department</label>
                <input type="text" class="form-control" id="exampleInputName1" placeholder="Nama department" name="nama_department">
            </div>
            <div class="form-group">
                <label for="exampleTextarea1" class="col-form-label">Deskripsi</label>
                <textarea class="form-control" name="deskripsi" id="exampleTextarea1" rows="4"></textarea>
            </div>
            <div>
                <button type="submit" class="btn btn-primary">Ubah</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>
    </div>
</div>
