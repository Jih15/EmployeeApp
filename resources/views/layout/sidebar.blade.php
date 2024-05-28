<nav class="sidebar sidebar-offcanvas" id="sidebar">
    <ul class="nav">
        <li class="nav-item nav-category">Main</li>
        <li class="nav-item">
            <a class="nav-link @yield('navDashboard')" href="/">
                <i class="menu-icon mdi mdi-view-dashboard"></i>
                <span class="menu-title">Dashboard</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @yield('navDepartment')" href="/department">
                <i class="menu-icon mdi mdi-briefcase"></i>
                <span class="menu-title">Department</span>
            </a>
            {{-- <a class="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <i class="menu-icon mdi mdi-briefcase"></i>
                <span class="menu-title">Department</span>
                <i class="menu-arrow"></i>
              </a>
            <div class="collapse" id="ui-basic">
                <ul class="nav flex-column sub-menu">
                    <li class="nav-item"> <a class="nav-link" href="/department">Department</a></li>
                    <li class="nav-item"> <a class="nav-link" href="../pages/ui-features/dropdowns.html">Dropdowns</a>
                    </li>
                    <li class="nav-item"> <a class="nav-link" href="../pages/ui-features/typography.html">Typography</a>
                    </li>
                </ul>
            </div> --}}
        </li>


        <li class="nav-item">
            <a class="nav-link @yield('navUser')" href="/user">
                <i class="menu-icon mdi mdi-clipboard-account"></i>
                <span class="menu-title">User</span>
            </a>
        </li>


        <li class="nav-item">
            <a class="nav-link @yield('navPosisi')" href="/posisi">
                <i class="menu-icon mdi mdi-folder-account"></i>
                <span class="menu-title">Posisi</span>
            </a>
        </li>

        <li class="nav-item nav-category">Management Karyawan</li>

        <li class="nav-item">
            <a class="nav-link @yield('navKaryawan')" href="/karyawan">
                <i class="menu-icon mdi mdi mdi-account-multiple"></i>
                <span class="menu-title">Karyawan</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @yield('navAbsen')" href="/absen">
                <i class="menu-icon mdi mdi-clock-in"></i>
                <span class="menu-title">Absensi</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @yield('navCuti')" href="/cuti">
                <i class="menu-icon mdi mdi-account-remove"></i>
                <span class="menu-title">Cuti</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @yield('navGaji')" href="/gaji">
                <i class="menu-icon mdi mdi-cash-multiple"></i>
                <span class="menu-title">Gaji</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @yield('navEvaluasi')" href="/evaluasi">
                <i class="menu-icon mdi mdi-trending-up"></i>
                <span class="menu-title">Evaluasi</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link @yield('navPelatihan')" href="/pelatihan">
                <i class="menu-icon mdi mdi-message-draw"></i>
                <span class="menu-title">Pelatihan</span>
            </a>
        </li>
    </ul>
</nav>
