@extends('layout.main')

@section('navDashboard', 'active')

@section('content-dashboard')
    <div class="row">
        <div class="col-sm-12">
            <div class="home-tab">
                <div class="d-sm-flex align-items-center justify-content-between border-bottom">
                    {{-- <div>
                            <div class="btn-wrapper">
                                <a href="#" class="btn btn-otline-dark align-items-center"><i class="icon-share"></i>
                                    Share</a>
                                <a href="#" class="btn btn-otline-dark"><i class="icon-printer"></i> Print</a>
                                <a href="#" class="btn btn-primary text-white me-0"><i class="icon-download"></i>
                                    Export</a>
                            </div>
                        </div> --}}
                </div>
                <div class="tab-content tab-content-basic">
                    <div class="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="statistics-details d-flex align-items-center justify-content-between">
                                    <div>
                                        <p class="statistics-title">Jumlah Pegawai</p>
                                        <h3 class="rate-percentage">{{ $totalKaryawans }} Org</h3>
                                        {{-- <p class="text-danger d-flex"><i
                                                    class="mdi mdi-menu-down"></i><span>-0.5%</span></p> --}}
                                    </div>
                                    <div>
                                        <p class="statistics-title">Page Views</p>
                                        <h3 class="rate-percentage">7,682</h3>
                                        <p class="text-success d-flex"><i class="mdi mdi-menu-up"></i><span>+0.1%</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p class="statistics-title">New Sessions</p>
                                        <h3 class="rate-percentage">68.8</h3>
                                        <p class="text-danger d-flex"><i class="mdi mdi-menu-down"></i><span>68.8</span>
                                        </p>
                                    </div>
                                    <div class="d-none d-md-block">
                                        <p class="statistics-title">Avg. Time on Site</p>
                                        <h3 class="rate-percentage">2m:35s</h3>
                                        <p class="text-success d-flex"><i class="mdi mdi-menu-down"></i><span>+0.8%</span>
                                        </p>
                                    </div>
                                    <div class="d-none d-md-block">
                                        <p class="statistics-title">New Sessions</p>
                                        <h3 class="rate-percentage">68.8</h3>
                                        <p class="text-danger d-flex"><i class="mdi mdi-menu-down"></i><span>68.8</span>
                                        </p>
                                    </div>
                                    <div class="d-none d-md-block">
                                        <p class="statistics-title">Avg. Time on Site</p>
                                        <h3 class="rate-percentage">2m:35s</h3>
                                        <p class="text-success d-flex"><i class="mdi mdi-menu-down"></i><span>+0.8%</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-8 d-flex flex-column">
                                <div class="row flex-grow">
                                    <div class="col-12 grid-margin stretch-card">
                                        <div class="card card-rounded">
                                            <div class="card-body">
                                                <div class="d-sm-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h4 class="card-title card-title-dash">List Karyawan</h4>
                                                        {{-- <p class="card-subtitle card-subtitle-dash">You
                                                            have 50+ new requests</p> --}}
                                                    </div>
                                                </div>
                                                <div class="table-responsive  mt-1">
                                                    <table class="table select-table">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                </th>
                                                                <th>ID Karyawan</th>
                                                                <th>Nama Karyawan</th>
                                                                <th>Department/Posisi</th>
                                                                <th>Manager</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            @foreach ($karyawans as $item)
                                                                <tr>
                                                                    <td>

                                                                    </td>
                                                                    <td>{{ $item->id_karyawan }}</td>
                                                                    <td>
                                                                        <div class="d-flex ">
                                                                            {{-- <img src="assets/images/faces/face1.jpg"
                                                                            alt=""> --}}
                                                                            <div>
                                                                                {{-- nama dan email --}}
                                                                                <h6>{{ $item->nama_depan }}
                                                                                    {{ $item->nama_belakang }}</h6>
                                                                                <p>{{ $item->email }}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{{ $item->_posisi->nama_posisi }}</h6>
                                                                        <p>{{ $item->_posisi->_department->nama_department }}
                                                                        </p>
                                                                    </td>
                                                                    <td>
                                                                        @if ($item->_manager)
                                                                            <h6>{{ $item->_manager->nama_depan }}
                                                                                {{ $item->_manager->nama_belakang }}</h6>
                                                                        @else
                                                                            <p>Tidak ada manager</p>
                                                                        @endif
                                                                    </td>
                                                                </tr>
                                                            @endforeach
                                                        </tbody>
                                                    </table>
                                                    <div>
                                                        <a href="/karyawan">
                                                            <button type="button"
                                                                class="btn btn-primary btn-md text-white mb-0 me-0">
                                                                See More
                                                            </button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row flex-grow">
                                    <div class="col-md-6 col-lg-6 grid-margin stretch-card">
                                        <div class="card card-rounded">
                                            <div class="card-body card-rounded">
                                                <h4 class="card-title  card-title-dash">Recent Events
                                                </h4>
                                                <div class="list align-items-center border-bottom py-2">
                                                    <div class="wrapper w-100">
                                                        <p class="mb-2 font-weight-medium">
                                                            Change in Directors
                                                        </p>
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div class="d-flex align-items-center">
                                                                <i class="mdi mdi-calendar text-muted me-1"></i>
                                                                <p class="mb-0 text-small text-muted">
                                                                    Mar 14, 2019</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="list align-items-center border-bottom py-2">
                                                    <div class="wrapper w-100">
                                                        <p class="mb-2 font-weight-medium">
                                                            Other Events
                                                        </p>
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div class="d-flex align-items-center">
                                                                <i class="mdi mdi-calendar text-muted me-1"></i>
                                                                <p class="mb-0 text-small text-muted">
                                                                    Mar 14, 2019</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="list align-items-center border-bottom py-2">
                                                    <div class="wrapper w-100">
                                                        <p class="mb-2 font-weight-medium">
                                                            Quarterly Report
                                                        </p>
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div class="d-flex align-items-center">
                                                                <i class="mdi mdi-calendar text-muted me-1"></i>
                                                                <p class="mb-0 text-small text-muted">
                                                                    Mar 14, 2019</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="list align-items-center border-bottom py-2">
                                                    <div class="wrapper w-100">
                                                        <p class="mb-2 font-weight-medium">
                                                            Change in Directors
                                                        </p>
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div class="d-flex align-items-center">
                                                                <i class="mdi mdi-calendar text-muted me-1"></i>
                                                                <p class="mb-0 text-small text-muted">
                                                                    Mar 14, 2019</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="list align-items-center pt-3">
                                                    <div class="wrapper w-100">
                                                        <p class="mb-0">
                                                            <a href="#" class="fw-bold text-primary">Show all
                                                                <i class="mdi mdi-arrow-right ms-2"></i></a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-lg-6 grid-margin stretch-card">
                                        <div class="card card-rounded">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                                            <h4 class="card-title card-title-dash">Type
                                                                By Amount</h4>
                                                        </div>
                                                        <div>
                                                            <canvas class="my-auto" id="doughnutChart" width="252"
                                                                height="251"
                                                                style="display: block; box-sizing: border-box; height: 200.8px; width: 201.6px;"></canvas>
                                                        </div>
                                                        <div id="doughnutChart-legend" class="mt-5 text-center">
                                                            <ul>
                                                                <li>
                                                                    <span style="background-color: #1F3BB3"></span>
                                                                    Total
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #FDD0C7"></span>
                                                                    Net
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #52CDFF"></span>
                                                                    Gross
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #81DADA"></span>
                                                                    AVG
                                                                </li>
                                                            </ul>
                                                            <ul>
                                                                <li>
                                                                    <span style="background-color: #1F3BB3"></span>
                                                                    Total
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #FDD0C7"></span>
                                                                    Net
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #52CDFF"></span>
                                                                    Gross
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #81DADA"></span>
                                                                    AVG
                                                                </li>
                                                            </ul>
                                                            <ul>
                                                                <li>
                                                                    <span style="background-color: #1F3BB3"></span>
                                                                    Total
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #FDD0C7"></span>
                                                                    Net
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #52CDFF"></span>
                                                                    Gross
                                                                </li>

                                                                <li>
                                                                    <span style="background-color: #81DADA"></span>
                                                                    AVG
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- <div class="col-md-6 col-lg-6 grid-margin stretch-card">
                                            <div class="card card-rounded">
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                                        <h4 class="card-title card-title-dash">Activities
                                                        </h4>
                                                        <p class="mb-0">20 finished, 5 remaining</p>
                                                    </div>
                                                    <ul class="bullet-line-list">
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Ben
                                                                        Tossell</span> assign you a task
                                                                </div>
                                                                <p>Just now</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Oliver
                                                                        Noah</span> assign you a task</div>
                                                                <p>1h</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Jack
                                                                        William</span> assign you a task
                                                                </div>
                                                                <p>1h</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Leo
                                                                        Lucas</span> assign you a task</div>
                                                                <p>1h</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Thomas
                                                                        Henry</span> assign you a task</div>
                                                                <p>1h</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Ben
                                                                        Tossell</span> assign you a task
                                                                </div>
                                                                <p>1h</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="d-flex justify-content-between">
                                                                <div><span class="text-light-green">Ben
                                                                        Tossell</span> assign you a task
                                                                </div>
                                                                <p>1h</p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div class="list align-items-center pt-3">
                                                        <div class="wrapper w-100">
                                                            <p class="mb-0">
                                                                <a href="#" class="fw-bold text-primary">Show all
                                                                    <i class="mdi mdi-arrow-right ms-2"></i></a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> --}}
                                </div>

                            </div>
                            <div class="col-lg-4 d-flex flex-column">
                                {{-- <div class="row flex-grow">
                                        <div class="col-12 grid-margin stretch-card">
                                            INI DIA
                                            <div class="card card-rounded">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <div
                                                                class="d-flex justify-content-between align-items-center mb-3">
                                                                <h4 class="card-title card-title-dash">Type
                                                                    By Amount</h4>
                                                            </div>
                                                            <div>
                                                                <canvas class="my-auto" id="doughnutChart" width="252"
                                                                    height="251"
                                                                    style="display: block; box-sizing: border-box; height: 200.8px; width: 201.6px;"></canvas>
                                                            </div>
                                                            <div id="doughnutChart-legend" class="mt-5 text-center">
                                                                <ul>
                                                                    <li>
                                                                        <span style="background-color: #1F3BB3"></span>
                                                                        Total
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #FDD0C7"></span>
                                                                        Net
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #52CDFF"></span>
                                                                        Gross
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #81DADA"></span>
                                                                        AVG
                                                                    </li>
                                                                </ul>
                                                                <ul>
                                                                    <li>
                                                                        <span style="background-color: #1F3BB3"></span>
                                                                        Total
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #FDD0C7"></span>
                                                                        Net
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #52CDFF"></span>
                                                                        Gross
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #81DADA"></span>
                                                                        AVG
                                                                    </li>
                                                                </ul>
                                                                <ul>
                                                                    <li>
                                                                        <span style="background-color: #1F3BB3"></span>
                                                                        Total
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #FDD0C7"></span>
                                                                        Net
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #52CDFF"></span>
                                                                        Gross
                                                                    </li>

                                                                    <li>
                                                                        <span style="background-color: #81DADA"></span>
                                                                        AVG
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> --}}



                                {{-- Top Performer --}}
                                <div class="row flex-grow">
                                    <div class="col-12 grid-margin stretch-card">
                                        <div class="card card-rounded">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                                            <div>
                                                                <h4 class="card-title card-title-dash">Top 3 Performer</h4>
                                                            </div>
                                                        </div>
                                                        <div class="mt-3">
                                                            @foreach ($evaluasis as $evaluasi)
                                                            <div class="wrapper d-flex align-items-center justify-content-between py-2 border-bottom">
                                                                <div class="d-flex">
                                                                    {{-- <img class="img-sm rounded-10" src="{{ $evaluasi->gambar }}" alt="profile"> --}}
                                                                    <img class="img-sm rounded-10"
                                                                                        src="{{$evaluasi->_karyawan->foto}}"
                                                                                        alt="profile">
                                                                    <div class="wrapper ms-3">
                                                                        <p class="ms-1 mb-1 fw-bold">{{ $evaluasi->_karyawan->nama_depan}} {{ $evaluasi->_karyawan->nama_belakang}}</p>
                                                                        <small class="text-muted mb-0">{{ $evaluasi->penilaian_kinerja }}</small>
                                                                    </div>
                                                                </div>
                                                                <div class="text-muted text-small">
                                                                    {{ $evaluasi->tahun_evaluasi }}
                                                                </div>
                                                            </div>
                                                            @endforeach
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row flex-grow">
                                    <div class="col-12 grid-margin stretch-card">
                                        <div class="card card-rounded">
                                            <div class="card-body">
                                                <div class="d-flex align-items-center justify-content-between mb-3">
                                                    <h4 class="card-title card-title-dash">Activities
                                                    </h4>
                                                    <p class="mb-0">20 finished, 5 remaining</p>
                                                </div>
                                                <ul class="bullet-line-list">
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Ben
                                                                    Tossell</span> assign you a task
                                                            </div>
                                                            <p>Just now</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Oliver
                                                                    Noah</span> assign you a task</div>
                                                            <p>1h</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Jack
                                                                    William</span> assign you a task
                                                            </div>
                                                            <p>1h</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Leo
                                                                    Lucas</span> assign you a task</div>
                                                            <p>1h</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Thomas
                                                                    Henry</span> assign you a task</div>
                                                            <p>1h</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Ben
                                                                    Tossell</span> assign you a task
                                                            </div>
                                                            <p>1h</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="d-flex justify-content-between">
                                                            <div><span class="text-light-green">Ben
                                                                    Tossell</span> assign you a task
                                                            </div>
                                                            <p>1h</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <div class="list align-items-center pt-3">
                                                    <div class="wrapper w-100">
                                                        <p class="mb-0">
                                                            <a href="#" class="fw-bold text-primary">Show all
                                                                <i class="mdi mdi-arrow-right ms-2"></i></a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {{-- Leave Report --}}
                                <div class="row flex-grow">
                                    <div class="col-12 grid-margin stretch-card">
                                        <div class="card card-rounded">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <div
                                                            class="d-flex justify-content-between align-items-center mb-3">
                                                            <div>
                                                                <h4 class="card-title card-title-dash">
                                                                    Leave Report</h4>
                                                            </div>
                                                            <div>
                                                                <div class="dropdown">
                                                                    <button
                                                                        class="btn btn-light dropdown-toggle toggle-dark btn-lg mb-0 me-0"
                                                                        type="button" id="dropdownMenuButton3"
                                                                        data-bs-toggle="dropdown" aria-haspopup="true"
                                                                        aria-expanded="false"> Month
                                                                        Wise </button>
                                                                    <div class="dropdown-menu"
                                                                        aria-labelledby="dropdownMenuButton3">
                                                                        <h6 class="dropdown-header">
                                                                            week Wise</h6>
                                                                        <a class="dropdown-item" href="#">Year
                                                                            Wise</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="mt-3">
                                                            <canvas id="leaveReport" width="252" height="187"
                                                                style="display: block; box-sizing: border-box; height: 149.6px; width: 201.6px;"></canvas>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
