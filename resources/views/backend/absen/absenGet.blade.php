@extends('layout.main')

@section('navAbsen', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">Data Absensi</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                        have 50+ new requests</p> --}}
                        </div>
                        <div>
                            {{-- <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#createAbsenModal">
                                    <i class="mdi mdi-plus"></i>
                                    &emsp;Tambahkan Absensi
                                </button>
                            </a> --}}
                        </div>
                    </div>
                    <div class="table-responsive  mt-1">
                        <table class="table select-table">
                            <thead>
                                <tr>
                                    <th>

                                    </th>
                                    <th>ID Absen</th>
                                    <th>Karyawan</th>
                                    <th>Tanggal Absen</th>
                                    <th>Jam Masuk</th>
                                    <th>Jam Keluar</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($absens as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{ $item->id_absen }}</td>
                                        <td>
                                            <h6>{{ $item->_karyawan->nama_depan }} {{ $item->_karyawan->nama_belakang }}
                                            </h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->tanggal_absen }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->jam_masuk }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->jam_keluar }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->status }}</h6>
                                        </td>
                                        {{-- <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-btn-absen"
                                                data-bs-toggle="modal" data-bs-target="#updateAbsenModal"
                                                data-id="{{$item->id_absen}}">Update</button>
                                            <br><br>
                                        </td> --}}
                                        <td>
                                            <form action="absen/{{ $item->id_absen }}" method="POST">
                                                @method('DELETE')
                                                @csrf
                                                <button type="submit" class="btn btn-outline-danger btn-rounded">
                                                    <i class="mdi mdi-delete"></i>
                                                </button>
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


    {{-- <div class="modal fade" id="createAbsenModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.absen.absenCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateAbsenModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.absen.absenUpdate')

            </div>
        </div>
    </div> --}}

@endsection
