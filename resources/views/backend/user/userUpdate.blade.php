<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Edit User</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">x</span>
        </button>
    </div>
    <div class="modal-body">
        <form id="updateUserForm" method="POST" action="/user/:id" novalidate="novalidate">
            @method('PUT')
            @csrf
            <div class="form-group">
                <input type="hidden" name="id_user" id="updateUserId" value="">
                <label for="input_username" class="col-form-label">Username</label>
                <input type="text" class="form-control" id="input_username" placeholder="Username" name="username">
            </div>

            <div class="form-group">
                <label for="input_email" class="col-form-label">Email</label>
                <input type="text" class="form-control" id="input_email" placeholder="Email" name="email">
            </div>

            <div class="form-group">
                <label for="input_password">Password</label>
                <input type="password" class="form-control" id="input_password" placeholder="Password" name="password">
            </div>

            <div class="form-group">
                <label for="exampleSelectAccess">Hak Akses</label>
                <select class="form-select" id="exampleSelectAccess" name="hak_akses">
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>User</option>
                </select>
            </div>

            <div>
                <button type="submit" class="btn btn-primary">Update</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>
    </div>
</div>
