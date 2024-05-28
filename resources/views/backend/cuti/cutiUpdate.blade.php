<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Ubah Data Cuti</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="modal-body">
        <form id="updateFormCuti" method="POST" action="/cuti/:id" novalidate="novalidate">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label for="karyawan" class="col-form-label">Karyawan</label>
                <select class="form-select form-select-md" id="karyawan" name="id_karyawan">
                    <option value="">Pilih karyawan</option>
                    @foreach ($karyawans as $kry)
                        <option value="{{ $kry->id_karyawan }}">{{ $kry->nama_depan }} {{$kry->nama_belakang}}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="tgl_mulai" class="col-form-label">Tanggal Mulai</label>
                <input type="date" class="form-control @error('tgl_mulai') is-invalid @enderror"
                    value="{{ old('tgl_mulai') }}" id="tgl_mulai" placeholder="Tanggal Mulai" name="tgl_mulai">
                @error('tgl_mulai')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="tgl_selesai" class="col-form-label">Tanggal Selesai</label>
                <input type="date" class="form-control @error('tgl_selesai') is-invalid @enderror"
                    value="{{ old('tgl_selesai') }}" id="tgl_selesai" placeholder="Tanggal Selesai" name="tgl_selesai">
                @error('tgl_selesai')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="jenis_cuti" class="col-form-label">Jenis Cuti</label>
                <input type="text" class="form-control @error('jenis_cuti') is-invalid @enderror"
                    value="{{ old('jenis_cuti') }}" id="jenis_cuti" placeholder="Masukkan Jenis Cuti" name="jenis_cuti">
                @error('jenis_cuti')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class=" mb-3 form-group">
                <label class="col-form-label">Status</label>
                <div class="col-form-check mt-1">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="status" value="selesai" type="radio" id="status_selesai">
                    <label class="col-form-check-label" for="status_selesai">
                        Telah Selesai
                    </label>
                </div>
                <div class="col-form-check">
                    <input class="col-form-check-input @error('status') is-invalid @enderror" name="status" value="cuti" type="radio" id="status_cuti">
                    <label class="col-form-check-label" for="status_cuti">
                        Dalam Masa Cuti
                    </label>
                </div>
            </div>

            <div>
                <button type="submit" class="btn btn-primary">Submit</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </form>
    </div>
</div>
