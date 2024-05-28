<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Tambahkan Absen Baru</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form method="POST" action="/absen" novalidate="novalidate">
            @csrf
            <div class="form-group">
                <label for="karyawan" class="col-form-label">Karyawan</label>
                <select class="form-select form-select-md" id="karyawan" name="id_karyawan">
                    <option value="">Pilih karyawan</option>
                    @foreach ($karyawans as $kry)
                        <option value="{{ $kry->id_karyawan }}">{{ $kry->nama_depan }} {{ $kry->nama_belakang }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="tanggal_absen" class="col-form-label">Tanggal Absen</label>
                <input type="date" class="form-control @error('tanggal_absen') is-invalid @enderror"
                    value="{{ old('tanggal_absen') }}" id="tanggal_absen" placeholder="Tanggal Lahir"
                    name="tanggal_absen">
                @error('tanggal_absen')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>


            <div class="form-group">
                <label for="jam_masuk" class="col-form-label">Jam Masuk</label>
                <input type="time" class="form-control @error('jam_masuk') is-invalid @enderror"
                    value="{{ old('jam_masuk') }}" id="jam_masuk" placeholder="Tanggal Masuk" name="jam_masuk">
                @error('jam_masuk')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="jam_keluar" class="col-form-label">Jam Keluar</label>
                <input type="time" class="form-control @error('jam_keluar') is-invalid @enderror"
                    value="{{ old('jam_keluar') }}" id="jam_keluar" placeholder="Tanggal Masuk" name="jam_keluar">
                @error('jam_keluar')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class=" mb-3 form-group">
                <label class="col-form-label">Status</label>
                <div class="col-form-check mt-1">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="status"
                        value="Hadir" type="radio" id="status_hadir">
                    <label class="col-form-check-label" for="status_hadir">
                        Hadir
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="status"
                        value="Izin" type="radio" id="status_izin">
                    <label class="col-form-check-label" for="status_izin">
                        Izin
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="status"
                        value="Alfa" type="radio" id="status_alfa">
                    <label class="col-form-check-label" for="status_alfa">
                        Alfa
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="status"
                        value="Sakit" type="radio" id="status_sakit">
                    <label class="col-form-check-label" for="status_sakit">
                        Sakit
                    </label>
                </div>
                <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
            </div>


            <button type="submit" class="btn btn-primary">Submit</button>
            <button class="btn btn-light">Cancel</button>
        </form>
    </div>
</div>
