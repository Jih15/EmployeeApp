@extends('layout.main')

@section('navKaryawan', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">List Karyawan</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                            have 50+ new requests</p> --}}
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <i class="mdi mdi-account-plus"></i>
                                    &emsp;Tambahkan karyawan
                                </button>
                            </a>
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
                                    <th>ID Karyawan</th>
                                    <th>Foto</th>
                                    <th>Nama Karyawan</th>
                                    <th>Department/Posisi</th>
                                    <th>Manager</th>
                                    <th>No. Telp</th>
                                    <th>Tanggal Lahir</th>
                                    <th>Jenis Kelamin</th>
                                    <th>Alamat</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($karyawans as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{ $item->id_karyawan }}</td>
                                        <td>
                                            <img class="img-sm rounded-10" src="{{$item->foto}}"
                                                alt="profile">
                                        </td>
                                        <td>
                                            <div class="d-flex ">
                                                {{-- <img src="assets/images/faces/face1.jpg"
                                            alt=""> --}}
                                                <div>
                                                    {{-- nama dan email --}}
                                                    <h6>{{ $item->nama_depan }} {{ $item->nama_belakang }}</h6>
                                                    <p>{{ $item->email }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <h6>{{ $item->_posisi->nama_posisi }}</h6>
                                            <p>{{ $item->_posisi->_department->nama_department }}</p>
                                        </td>
                                        <td>
                                            <h6>{{ $item->id_manager }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->no_telp }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->tgl_lahir }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->jenis_kelamin }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->alamat }}</h6>
                                        </td>
                                        <td>
                                            <button type="button"
                                                class="btn btn-info btn-rounded btn-sm update-karyawan-btn"
                                                data-bs-toggle="modal" data-bs-target="#updateKaryawanModal"
                                                data-id="{{ $item->id_karyawan }}">Update</button>

                                            <br><br>
                                            <form action="/karyawan/{{ $item->id_karyawan }}" method="POST">
                                                @method('DELETE')
                                                @csrf
                                                <button type="submit"
                                                    class="btn btn-outline-danger btn-rounded btn-sm">Delete</button>
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


    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.karyawan.karyawanCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateKaryawanModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.karyawan.karyawanUpdate')

            </div>
        </div>
    </div>

@endsection
