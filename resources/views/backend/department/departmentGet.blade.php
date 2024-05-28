@extends('layout.main')

@section('navDepartment', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">Department</h4>
                            <p class="card-subtitle card-subtitle-dash">Total department ada sebanyak
                                {{ $departments->count() }} department</p>
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <i class="mdi mdi-plus"></i>
                                    &emsp;Tambahkan Department
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="table-responsive  mt-1">
                        <table class="table select-table">
                            <thead>
                                <tr>
                                    <th>

                                    </th>
                                    <th>ID Department</th>
                                    <th>Nama Department</th>
                                    <th>Deskripsi</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($departments as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>
                                            <h6>{{ $item->id_department }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->nama_department }}</h6>
                                        </td>
                                        <td>
                                            <p>{{ $item->deskripsi }}</p>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-department-btn"
                                                data-bs-toggle="modal" data-bs-target="#updateModal"
                                                data-id="{{ $item->id_department }}">Update</button>

                                            <br><br>
                                            <form action="{{ url('department', $item->id_department) }}" method="POST">
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

                @include('backend.department.departmentCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.department.departmentUpdate')

            </div>
        </div>
    </div>



@endsection
