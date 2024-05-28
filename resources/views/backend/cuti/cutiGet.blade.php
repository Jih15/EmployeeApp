@extends('layout.main')

@section('navCuti', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">Data Cuti Karyawan</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                        have 50+ new requests</p> --}}
                        </div>
                        <div>
                            {{-- <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#cutiModal">
                                    <i class="mdi mdi-plus"></i>
                                    &emsp;Tambahkan Data Cuti
                                </button>
                            </a> --}}
                        </div>
                    </div>
                    <div class="table-responsive  mt-1">
                        <table class="table select-table">
                            <thead>
                                <tr>
                                    <th>
                                        {{-- <div class="form-check form-check-flat mt-0">
                                    <label class="form-check-label">
                                        <input type="checkbox"
                                            class="form-check-input"
                                            aria-checked="false"><i
                                            class="input-helper"></i><i
                                            class="input-helper"></i></label>
                                </div> --}}
                                    </th>
                                    <th>ID Cuti</th>
                                    <th>Nama Karyawan</th>
                                    <th>Tanggal Mulai</th>
                                    <th>Tanggal Selesai</th>
                                    <th>Keterangan Cuti</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($cutis as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{ $item->id_cuti }}</td>
                                        <td>
                                            <h6>{{ $item->_karyawan->nama_depan }} {{ $item->_karyawan->nama_belakang }}
                                            </h6>
                                        </td>
                                        <td>
                                            <div class="d-flex ">
                                                {{-- <img src="assets/images/faces/face1.jpg"
                                        alt=""> --}}
                                                <div>
                                                    <h6>{{ $item->tgl_mulai }}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <h6>{{ $item->tgl_selesai }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->keterangan_cuti }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->status }}</h6>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-btn">Setujui</button>
                                            <br><br>
                                            <button class="btn btn-outline-danger btn-rounded btn-sm">Tolak</button>
                                            <br><br>
                                            <form action="/cuti/{{ $item->id_cuti }}" method="POST">
                                                @method('DELETE')
                                                @csrf
                                                <button type="submit"
                                                    class="btn btn-outline-danger btn-rounded btn-sm"><i class="mdi mdi-delete"></i></button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- <div class="modal fade" id="cutiModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.cuti.cutiCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateCutiModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.cuti.cutiUpdate')

            </div>
        </div>
    </div> --}}

@endsection
