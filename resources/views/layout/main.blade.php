<!DOCTYPE html>
<html lang="en">
<head>

    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Sistem Kepegawaian</title>
    <!-- plugins:css -->
    <link rel="stylesheet" href="assets/vendors/feather/feather.css">
    <link rel="stylesheet" href="assets/vendors/mdi/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="assets/vendors/ti-icons/css/themify-icons.css">
    <link rel="stylesheet" href="assets/vendors/typicons/typicons.css">
    <link rel="stylesheet" href="assets/vendors/simple-line-icons/css/simple-line-icons.css">
    <link rel="stylesheet" href="assets/vendors/css/vendor.bundle.base.css">
    <!-- endinject -->
    <!-- Plugin css for this page -->
    <link rel="stylesheet" href="assets/vendors/datatables.net-bs4/dataTables.bootstrap4.css">
    <link rel="stylesheet" type="text/css" href="assets/js/select.dataTables.min.css">
    <!-- End plugin css for this page -->
    <!-- inject:css -->
    <link rel="stylesheet" href="assets/css/vertical-layout-light/style.css">
    <!-- endinject -->
    <link rel="shortcut icon" href="assets/images/favicon.png" />
    <title>Document</title>
</head>
<body class="with-welcome-text">
    <div class="container-scroller">

        @include('layout.header')

        <div class="container-fluid page-body-wrapper">

            @include('layout.settingWrap')

            @include('layout.sidebar')

            <div class="main-panel">

                <div class="content-wrapper">
                    @yield('content-dashboard')
                </div>

            </div>

        </div>

        @include('layout.footer')

    </div>

    <!-- plugins:js -->
    <script src="assets/vendors/js/vendor.bundle.base.js"></script>
    <script src="assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js"></script>
    <!-- endinject -->
    <!-- Plugin js for this page -->
    <script src="assets/vendors/chart.js/Chart.min.js"></script>
    <script src="assets/vendors/progressbar.js/progressbar.min.js"></script>
    <!-- End plugin js for this page -->
    <!-- inject:js -->
    <script src="assets/js/off-canvas.js"></script>
    <script src="assets/js/hoverable-collapse.js"></script>
    <script src="assets/js/template.js"></script>
    <script src="assets/js/settings.js"></script>
    <script src="assets/js/todolist.js"></script>
    <!-- endinject -->
    <!-- Custom js for this page-->
    <script src="assets/js/jquery.cookie.js" type="text/javascript"></script>
    <script src="assets/js/dashboard.js"></script>
    <script src="assets/js/proBanner.js"></script>

    {{-- CRUD JS --}}
    <script src="assets/js/updateDepartment.js"></script>
    <script src="assets/js/updatePosisi.js"></script>
    <script src="assets/js/updateUser.js"></script>
    <script src="assets/js/updateKaryawan.js"></script>
    <script src="assets/js/updateAbsen.js"></script>
    <script src="assets/js/updateCuti.js"></script>
    <script src="assets/js/updateEvaluasi.js"></script>
    <script src="assets/js/selectDepartment.js"></script>

    {{-- ajax --}}
    <script src="assets/js/ajax-gaji.js"></script>

    <!-- <script src="../../assets/js/Chart.roundedBarCharts.js"></script> -->
    <!-- End custom js for this page-->
</body>
</html>
