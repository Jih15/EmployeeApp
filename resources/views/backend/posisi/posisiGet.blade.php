@extends('layout.main')

@section('navPosisi', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">Posisi</h4>
                            <p class="card-subtitle card-subtitle-dash">Total posisi ada sebanyak {{ $posisis->count() }}
                                posisi</p>
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#createModal">
                                    <i class="mdi mdi-plus"></i>
                                    &emsp;Tambahkan Posisi
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="table-responsive mt-1">
                        <table class="table select-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>ID Posisi</th>
                                    <th>Department</th>
                                    <th>Nama Posisi</th>
                                    <th>Gaji Pokok</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($posisis as $item)
                                    <tr>
                                        <td></td>
                                        <td>
                                            <h6>{{ $item->id_posisi }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->_department->nama_department }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->nama_posisi }}</h6>
                                        </td>
                                        <td>
                                            <h6>Rp. {{ number_format($item->gaji_pokok, 0, ',', '.') }}</h6>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-posisi-btn"
                                                data-bs-toggle="modal" data-bs-target="#updateModal"
                                                data-id="{{ $item->id_posisi }}">Update</button>

                                            <br><br>
                                            <form action="/posisi/{{ $item->id_posisi }}" method="POST">
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

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.posisi.posisiCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.posisi.posisiUpdate')

            </div>
        </div>
    </div>

@endsection
