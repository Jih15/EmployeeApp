<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Karyawan Baru</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/karyawan" novalidate="novalidate">
            @csrf
            <div class="form-group">
                <label for="user" class="col-form-label">User</label>
                <select class="form-select form-select-md" id="user" name="id_user">
                    <option value="">Pilih User</option>
                    @foreach ($user as $usr)
                        <option value="{{ $usr->id_user }}">{{ $usr->username }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="nama_depan" class="col-form-label">Nama Depan</label>
                <input type="text" class="form-control @error('nama_depan') is-invalid @enderror"
                    value="{{ old('nama_depan') }}" id="nama_depan" placeholder="Nama Depan" name="nama_depan">
                @error('nama_depan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="nama_belakang" class="col-form-label">Nama Belakang</label>
                <input type="text" class="form-control @error('nama_belakang') is-invalid @enderror"
                    value="{{ old('nama_belakang') }}" id="nama_belakang" placeholder="Nama Belakang"
                    name="nama_belakang">
                @error('nama_belakang')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="posisi" class="col-form-label">Posisi</label>
                <select class="form-select form-select-md" id="posisi" name="id_posisi">
                    <option value="">Pilih Posisi</option>
                    @foreach ($posisis as $pos)
                        @php
                            $departmentName = $pos->_department->nama_department;
                            $posisiName = $pos->nama_posisi;
                            $displayText = "$posisiName - $departmentName";
                        @endphp
                        <option value="{{ $pos->id_posisi }}">{{ $displayText }}</option>>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="manager" class="col-form-label">Manager</label>
                <select class="form-select form-select-md" id="karyawan" name="id_manager">
                    <option value="">Pilih Manager</option>
                    @foreach ($karyawans as $kry)
                        @php
                            $selected = ($kry->id_karyawan == $kry->id_manager) ? 'selected' : '';
                        @endphp
                        <option value="{{ $kry->id_karyawan }}" {{ $selected }}>{{ $kry->nama_depan}} {{$kry->nama_belakang}}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="exampleSelectGender">Jenis Kelamin</label>
                <select class="form-select" id="exampleSelectGender" name="jenis_kelamin">
                    <option>Laki-Laki</option>
                    <option>Perempuan</option>
                </select>
            </div>

            <div class="form-group">
                <label for="tgl_lahir" class="col-form-label">Tanggal Lahir</label>
                <input type="date" class="form-control @error('tgl_lahir') is-invalid @enderror"
                    value="{{ old('tgl_lahir') }}" id="tgl_lahir" placeholder="Tanggal Lahir" name="tgl_lahir">
                @error('tgl_lahir')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="message-text" class="col-form-label">Alamat</label>
                <textarea class="form-control @error('alamat') is-invalid @enderror" name="alamat" id="exampleTextarea1"
                    rows="4">{{ old('alamat') }}</textarea>
                @error('alamat')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="no_telp" class="col-form-label">No Telp</label>
                <input type="text" class="form-control @error('no_telp') is-invalid @enderror"
                    value="{{ old('no_telp') }}" id="no_telp" placeholder="No Telp" name="no_telp">
                @error('no_telp')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="email" class="col-form-label">Email</label>
                <input type="email" class="form-control @error('email') is-invalid @enderror"
                    value="{{ old('email') }}" id="email" placeholder="Email" name="email">
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="text" class="col-form-label">Foto</label>
                <input type="text" class="form-control @error('foto') is-invalid @enderror"
                    value="{{ old('foto') }}" id="foto" placeholder="Masukkan Link Foto" name="foto">
                @error('foto')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="tgl_masuk" class="col-form-label">Tanggal Masuk</label>
                <input type="date" class="form-control @error('tgl_masuk') is-invalid @enderror"
                    value="{{ old('tgl_masuk') }}" id="tgl_masuk" placeholder="Tanggal Masuk" name="tgl_masuk">
                @error('tgl_masuk')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
            <button class="btn btn-light">Cancel</button>
        </form>
    </div>
</div>
