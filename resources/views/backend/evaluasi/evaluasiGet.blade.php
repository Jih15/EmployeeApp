@extends('layout.main')

@section('navEvaluasi', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">List Hasil Evaluasi</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                        have 50+ new requests</p> --}}
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#evaluasiModal">
                                    <i class="mdi mdi-plus"></i>
                                    &emsp;Tambahkan Hasil Evaluasi
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
                                    <th>ID Evaluasi</th>
                                    <th>Nama Karyawan</th>
                                    <th>Tanggal Evaluasi</th>
                                    <th>Penilaian Kinerja</th>
                                    <th>Catatan</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($evaluasis as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{ $item->id_evaluasi }}</td>
                                        <td>
                                            <h6>{{ $item->_karyawan->nama_depan }}</h6>
                                        </td>
                                        <td>
                                            <div class="d-flex ">
                                                {{-- <img src="assets/images/faces/face1.jpg"
                                        alt=""> --}}
                                                <div>
                                                    <h6>{{ $item->tahun_evaluasi }}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {{-- <h6></h6> --}}
                                            <div>
                                                <div
                                                    class="d-flex justify-content-between align-items-center mb-1 max-width-progress-wrap">
                                                    @php
                                                        $penilaian = $item->penilaian_kinerja;
                                                        $textClass = '';
                                                        if ($penilaian < 50) {
                                                            $textClass = 'text-danger';
                                                        } elseif ($penilaian < 75) {
                                                            $textClass = 'text-warning';
                                                        } else {
                                                            $textClass = 'text-success';
                                                        }
                                                    @endphp
                                                    <p class="{{$textClass}}">{{ $item->penilaian_kinerja }} / 100</p>
                                                </div>
                                                <div class="progress progress-md">
                                                    @php
                                                        $penilaian = $item->penilaian_kinerja;
                                                        $class = '';
                                                        if ($penilaian < 50) {
                                                            $class = 'bg-danger';
                                                        } elseif ($penilaian < 75) {
                                                            $class = 'bg-warning';
                                                        } else {
                                                            $class = 'bg-success';
                                                        }
                                                    @endphp
                                                    <div class="progress-bar {{ $class }}" role="progressbar"
                                                        style="width: {{ $penilaian }}%"
                                                        aria-valuenow="{{ $penilaian }}" aria-valuemin="0"
                                                        aria-valuemax="101">
                                                    </div>
                                                </div>
                                            </div>

                                        </td>
                                        <td>
                                            <h6>{{ $item->catatan }}</h6>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-btn-evaluasi"
                                                data-bs-toggle="modal" data-bs-target="#updateEvaluasiModal"
                                                data-id="{{ $item->id_evaluasi }}">Update</button>

                                            <br><br>
                                            <form action="evaluasi/{{ $item->id_evaluasi }}" method="POST">
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

    <div class="modal fade" id="evaluasiModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.evaluasi.evaluasiCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateEvaluasiModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.evaluasi.evaluasiUpdate')

            </div>
        </div>
    </div>

@endsection
