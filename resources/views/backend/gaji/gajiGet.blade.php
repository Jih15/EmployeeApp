@extends('layout.main')

@section('navGaji', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">List Gaji</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                        have 50+ new requests</p> --}}
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#gajiCreateModal">
                                    <i class="mdi mdi-plus"></i>
                                    &emsp;Tambahkan Gaji
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
                                    <th>ID Gaji</th>
                                    <th>Nama Karyawan</th>
                                    <th>Gaji Pokok</th>
                                    <th>Tunjangan</th>
                                    <th>Potongan</th>
                                    <th>Total Gaji</th>
                                    <th>Tanggal Penggajian</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($gajis as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{ $item->id_gaji }}</td>
                                        <td>
                                            <h6>{{ $item->_karyawan->nama_depan }} {{ $item->_karyawan->nama_belakang }}
                                            </h6>
                                        </td>
                                        <td>
                                            <h6>Rp. {{ number_format($item->gaji_pokok, 0, ',', '.') }}</h6>
                                            {{-- <p>{{ $item->_posisi->id_gaji }}</p> --}}
                                        </td>
                                        <td>
                                            <h6>Rp. {{ number_format($item->tunjangan, 0, ',', '.') }}</h6>
                                            <p class="text-success d-flex">+ Bonus Kinerja (Rp. {{ number_format($item->bonus, 0, ',', '.') }})</p>
                                        </td>
                                        <td>
                                            <h6>Rp. {{ number_format($item->potongan, 0, ',', '.') }}</h6>
                                        </td>
                                        <td>
                                            <h6>Rp. {{ number_format($item->total_gaji, 0, ',', '.') }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->tanggal_penggajian }}</h6>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-btn"
                                                data-bs-toggle="modal" data-bs-target="#updateUserModal"
                                                data-id="{{ $item->id_gaji }}">Update</button>

                                            <br><br>
                                            <form action="gaji/{{ $item->id_gaji }}" method="POST">
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

    <div class="modal fade" id="gajiCreateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.gaji.gajiCreate')

            </div>
        </div>
    </div>

@endsection
