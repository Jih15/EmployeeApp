<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Ubah Data Karyawan</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form id="updateKaryawanForm" method="POST" action="/karyawan/:id" novalidate="novalidate">
            @method('PUT')
            @csrf
            <div class="form-group">
                <input type="hidden" name="id_karyawan" id="updateKaryawanId" value="{{ $item->id_karyawan }}">
                <label for="user" class="col-form-label">User</label>
                <select class="form-select form-select-md" id="user" name="cur_id_user">
                    <option value="">Pilih User</option>
                    @foreach ($user as $usr)
                        <option value="{{ $usr->id_user }}">{{ $usr->username }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="nama_depan" class="col-form-label">Nama Depan</label>
                <input type="text" class="form-control @error('nama_depan') is-invalid @enderror"
                    value="{{ trim($item->nama_depan) }}" id="nama_depan" placeholder="Nama Depan" name="cur_nama_depan">
                @error('nama_depan')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="nama_belakang" class="col-form-label">Nama Belakang</label>
                <input type="text" class="form-control @error('nama_belakang') is-invalid @enderror"
                    value="{{ trim($item->nama_belakang) }}" id="nama_belakang" placeholder="Nama Belakang"
                    name="cur_nama_belakang">
                @error('nama_belakang')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="posisi" class="col-form-label">Posisi</label>
                <select class="form-select form-select-md" id="posisi" name="cur_id_posisi">
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
                <label for="karyawan" class="col-form-label">Manager</label>
                <select class="form-select form-select-md" id="karyawan" name="cur_id_manager">
                    <option value="">Pilih Manager</option>
                    @foreach ($karyawans as $kry)
                        <option value="{{ $kry->id_karyawan }}">{{ $kry->nama_depan }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="exampleSelectGender">Jenis Kelamin</label>
                <select class="form-select" id="exampleSelectGender" name="cur_jenis_kelamin">
                    <option>Laki-Laki</option>
                    <option>Perempuan</option>
                </select>
            </div>

            <div class="form-group">
                <label for="tgl_lahir" class="col-form-label">Tanggal Lahir</label>
                <input type="date" class="form-control @error('tgl_lahir') is-invalid @enderror"
                    value="{{ trim($item->tgl_lahir) }}" id="tgl_lahir" placeholder="Tanggal Lahir" name="cur_tgl_lahir">
                @error('tgl_lahir')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="message-text" class="col-form-label">Alamat</label>
                <textarea class="form-control @error('alamat') is-invalid @enderror" name="cur_alamat" id="exampleTextarea1"
                    rows="4">{{ trim($item->alamat) }}</textarea>
                @error('alamat')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="no_telp" class="col-form-label">No Telp</label>
                <input type="text" class="form-control @error('no_telp') is-invalid @enderror"
                    value="{{ trim($item->no_telp) }}" id="no_telp" placeholder="No Telp" name="cur_no_telp">
                @error('no_telp')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="email" class="col-form-label">Email</label>
                <input type="email" class="form-control @error('email') is-invalid @enderror"
                    value="{{ trim($item->email) }}" id="email" placeholder="Email" name="cur_email">
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="text" class="col-form-label">Foto</label>
                <input type="text" class="form-control @error('foto') is-invalid @enderror"
                    value="{{ old('foto') }}" id="foto" placeholder="Masukkan Link Foto" name="cur_foto">
                @error('foto')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="tgl_masuk" class="col-form-label">Tanggal Masuk</label>
                <input type="date" class="form-control @error('tgl_masuk') is-invalid @enderror"
                    value="{{ trim($item->tgl_masuk) }}" id="tgl_masuk" placeholder="Tanggal Masuk" name="cur_tgl_masuk">
                @error('tgl_masuk')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="btn btn-primary">Ubah</button>
            <button class="btn btn-light">Cancel</button>
        </form>
    </div>
</div>
