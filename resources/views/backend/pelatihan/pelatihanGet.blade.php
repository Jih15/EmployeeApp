@extends('layout.main')

@section('navPelatihan', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">List Pelatihan</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                            have 50+ new requests</p> --}}
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#pelatihanModal">
                                    <i class="mdi mdi-account-plus"></i>
                                    &emsp;Tambahkan Pelatihan
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
                                    <th>ID Pelatihan</th>
                                    <th>Nama Karyawan</th>
                                    <th>Nama Pelatihan</th>
                                    <th>Tanggal Pelatihan</th>
                                    <th>Lokasi Pelatihan</th>
                                    <th>Lama Pelatihan</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($pelatihans as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{$item->id_pelatihan}}</td>
                                        <td><h6>{{$item->_karyawan->nama_depan}}</h6></td>
                                        <td>
                                            <div class="d-flex ">
                                                {{-- <img src="assets/images/faces/face1.jpg"
                                            alt=""> --}}
                                                <div>
                                                    <h6>{{ $item->nama_pelatihan }}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <h6>{{ $item->tgl_pelatihan }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->lokasi_pelatihan }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->lama_pelatihan }}</h6>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-btn" data-bs-toggle="modal" data-bs-target="#updateUserModal" data-id="{{ $item->id_pelatihan }}">Update</button>

                                            <br><br>
                                            <form action="pelatihan/{{$item->id_pelatihan}}" method="POST">
                                                @method('DELETE')
                                                @csrf
                                                <button type="submit" class="btn btn-outline-danger btn-rounded btn-sm">Delete</button>
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


    <div class="modal fade" id="pelatihanModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.pelatihan.pelatihanCreate')

            </div>
        </div>
    </div>



@endsection
