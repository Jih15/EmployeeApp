<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan User Baru</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">x</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/user" novalidate="novalidate">
            @csrf

            <div class="form-group">
                <label for="username" class="col-form-label">Username</label>
                <input type="text" class="form-control @error('username') is-invalid @enderror"
                    value="{{ old('username') }}" id="username" placeholder="Username" name="username">
                @error('username')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="email" class="col-form-label">Email</label>
                <input type="text" class="form-control @error('email') is-invalid @enderror"
                    value="{{ old('email') }}" id="email" placeholder="Email" name="email">
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>


            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control @error('password') is-invalid @enderror"
                    value="{{ old('password') }}" id="password" placeholder="Password" name="password">
                @error('password')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="exampleSelectAccess">Hak Akses</label>
                <select class="form-select" id="exampleSelectGender" name="hak_akses">
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>User</option>
                </select>
            </div>

            <div>
                <button type="submit" class="btn btn-primary">Tambahkan</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>
    </div>
</div>
