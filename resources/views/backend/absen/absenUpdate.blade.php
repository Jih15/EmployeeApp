<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Ubah Data Absensi</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form id="updateFormAbsen" method="POST" action="/absen/:id" novalidate="novalidate">
            @method('PUT')
            @csrf
            <input type="hidden" name="id_absen" id="updateAbsenId" value="">
            <div class="form-group">
                <label for="karyawan" class="col-form-label">Karyawan</label>
                <select class="form-select form-select-md" id="karyawan" name="cur_ab_id_karyawan">
                    <option value="">Pilih karyawan</option>
                    @foreach ($karyawans as $karyawan)
                        <option value="{{ $karyawan->id_karyawan }}">{{ $karyawan->nama_depan }} {{ $karyawan->nama_belakang }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="tgl_absen" class="col-form-label">Tanggal Absen</label>
                <input type="date" class="form-control @error('tgl_absen') is-invalid @enderror"
                    value="{{ old('tgl_absen', $item->tgl_absen) }}" id="tgl_absen" name="cur_tgl_absen">
                @error('tgl_absen')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="jam_masuk" class="col-form-label">Jam Masuk</label>
                <input type="time" class="form-control @error('jam_masuk') is-invalid @enderror"
                    value="{{ old('jam_masuk', $item->jam_masuk) }}" id="jam_masuk" name="cur_jam_masuk">
                @error('jam_masuk')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="jam_keluar" class="col-form-label">Jam keluar</label>
                <input type="time" class="form-control @error('jam_keluar') is-invalid @enderror"
                    value="{{ old('jam_keluar', $item->jam_keluar) }}" id="jam_keluar" name="cur_jam_keluar">
                @error('jam_keluar')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class=" mb-3 form-group">
                <label class="col-form-label">Status</label>
                <div class="col-form-check mt-1">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="cur_status"
                        value="Hadir" type="radio" id="status_hadir">
                    <label class="col-form-check-label" for="status_hadir">
                        Hadir
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="cur_status"
                        value="Izin" type="radio" id="status_izin">
                    <label class="col-form-check-label" for="status_izin">
                        Izin
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="cur_status"
                        value="Alfa" type="radio" id="status_alfa">
                    <label class="col-form-check-label" for="status_alfa">
                        Alfa
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="cur_status"
                        value="Sakit" type="radio" id="status_sakit">
                    <label class="col-form-check-label" for="status_sakit">
                        Sakit
                    </label>
                </div>
                <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
            </div>

            <div>
                <button type="submit" class="btn btn-primary">Submit</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            </div>
        </form>
    </div>
</div>
