@extends('layout.main')

@section('navUser', 'active')
@section('content-dashboard')

    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card card-rounded">
                <div class="card-body">
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title card-title-dash">List User</h4>
                            {{-- <p class="card-subtitle card-subtitle-dash">You
                        have 50+ new requests</p> --}}
                        </div>
                        <div>
                            <a href="#">
                                <button type="button" class="btn btn-primary btn-md text-white mb-0 me-0"
                                    data-bs-toggle="modal" data-bs-target="#createUserModal">
                                    <i class="mdi mdi-account-plus"></i>
                                    &emsp;Tambahkan User
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
                                    <th>ID User</th>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Hak Akses</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($users as $item)
                                    <tr>
                                        <td>

                                        </td>
                                        <td>{{ $item->id_user }}</td>
                                        <td>
                                            <div class="d-flex ">
                                                {{-- <img src="assets/images/faces/face1.jpg"
                                        alt=""> --}}
                                                <div>
                                                    {{-- nama dan email --}}
                                                    <h6>{{ $item->username }}</h6>
                                                    <p>{{ $item->email }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <h6>{{ $item->password }}</h6>
                                        </td>
                                        <td>
                                            <h6>{{ $item->hak_akses }}</h6>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-info btn-rounded btn-sm update-user-btn"
                                                data-bs-toggle="modal" data-bs-target="#updateUserModal"
                                                data-id="{{ $item->id_user }}">Update</button>

                                            <br><br>
                                            <form action="user/{{ $item->id_user }}" method="POST">
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

    <div class="modal fade" id="createUserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.user.userCreate')

            </div>
        </div>
    </div>

    <div class="modal fade" id="updateUserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                @include('backend.user.userUpdate')

            </div>
        </div>
    </div>

@endsection
