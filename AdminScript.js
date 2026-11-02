/* =========================================================================
   ECLARO ACADEMY — ADMIN DASHBOARD
   Vanilla HTML/CSS/JS only. Data persisted via localStorage.
   ========================================================================= */

const LOGO_ICON = "logo-icon.png";
const LOGO_FULL = "logo-full.png";
const STORAGE_KEY = "eclaro_admin_dashboard_v2";

const DEPARTMENTS = ["ICT"];
const OFFICES = ["Registrar","Library","Accounting","Laboratory","Guidance","Property"];
const OFFICE_ICON = {Registrar:"📋",Library:"📚",Accounting:"💳",Laboratory:"🧪",Guidance:"🧭",Property:"🏷️"};

/* ---------------- default demo data ---------------- */
function defaultData(){
  const mkClearance = ()=>{
    const c = {};
    OFFICES.forEach(o=>c[o]="N/A");
    return c;
  };
  return {
    students: [
      {id:"20260001", name:"[No Name]", email:"student01@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Aug 02, 2026"},
      {id:"20260002", name:"[No Name]", email:"student02@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Jul 28, 2026"},
      {id:"20260003", name:"[No Name]", email:"student03@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Aug 03, 2026"},
      {id:"20260004", name:"[No Name]", email:"student04@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Aug 01, 2026"},
      {id:"20260005", name:"[No Name]", email:"student05@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Jul 25, 2026"},
      {id:"20260006", name:"[No Name]", email:"student06@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Aug 05, 2026"},
      {id:"20260007", name:"[No Name]", email:"student07@eclaro.edu.ph", contact:"N/A", department:"ICT", grade:"N/A", section:"N/A", status:"N/A", accountStatus:"N/A",
        clearance:mkClearance(), dateSubmitted:"Aug 04, 2026"},
    ],
    admins: [
      {name:"[No Name]", username:"admin", email:"admin@eclaro.edu.ph", role:"Super Admin"},
    ],
    faculty: [
      {empId:"F-1001", name:"[No Name]", email:"faculty01@eclaro.edu.ph", contact:"N/A", department:"Registrar", designation:"Registrar Officer", campus:"Main Campus", employment:"Permanent"},
      {empId:"F-1002", name:"[No Name]", email:"faculty02@eclaro.edu.ph", contact:"N/A", department:"Library", designation:"Librarian", campus:"Main Campus", employment:"Part-time"},
    ],
    offices: OFFICES.map(o=>({name:o, status:"Active"})),
    requirements: [
      {office:"Registrar", requirement:"Academic Records", required:"Yes", status:"Active"},
      {office:"Library", requirement:"Book Clearance", required:"Yes", status:"Active"},
      {office:"Accounting", requirement:"Financial Clearance", required:"Yes", status:"Active"},
      {office:"Laboratory", requirement:"Equipment Clearance", required:"Yes", status:"Active"},
      {office:"Guidance", requirement:"Guidance Clearance", required:"Yes", status:"Active"},
      {office:"Property", requirement:"Property Clearance", required:"Yes", status:"Active"},
    ],
    clearanceRequests: [
      {requestId:"REQ-1001", studentId:"20260001", department:"ICT", dateSubmitted:"Aug 10, 2026", currentOffice:"Library", status:"N/A"},
      {requestId:"REQ-1002", studentId:"20260003", department:"ICT", dateSubmitted:"Aug 10, 2026", currentOffice:"Accounting", status:"N/A"},
      {requestId:"REQ-1003", studentId:"20260006", department:"ICT", dateSubmitted:"Aug 11, 2026", currentOffice:"Registrar", status:"N/A"},
      {requestId:"REQ-1004", studentId:"20260007", department:"ICT", dateSubmitted:"Aug 11, 2026", currentOffice:"Library", status:"N/A"},
    ],
    notifications: [
      {title:"New clearance request", text:"[No Name] (20260006) submitted a clearance request.", time:"1h ago", read:false},
      {title:"Clearance approved", text:"[No Name]'s (20260002) Property requirement was approved.", time:"3h ago", read:false},
      {title:"Deadline reminder", text:"Clearance deadline is approaching — August 30, 2026.", time:"1d ago", read:false},
      {title:"Clearance rejected", text:"[No Name]'s (20260004) Registrar requirement was rejected.", time:"2d ago", read:true},
    ],
    deadline: {start:"2026-08-01", end:"2026-08-30", schoolYear:"2025-2026"},
    settings: {},
  };
}

let state = loadState();
state.page = "dashboard";
state.sidebarCollapsed = false;
state.sidebarMobileOpen = false;
state.search = "";
state.filters = {status:"", department:"", grade:""};
state.toastId = 0;
state.reportFilters = {year:"", department:"", grade:"", section:""};

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){ return JSON.parse(raw); }
  }catch(e){ console.warn("Could not read saved data, using defaults.", e); }
  return defaultData();
}
function persist(){
  try{
    const {page,sidebarCollapsed,sidebarMobileOpen,search,filters,toastId,reportFilters, ...toSave} = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }catch(e){ console.warn("Could not save data.", e); }
}

/* ---------------- helpers ---------------- */
function toast(msg, type){
  const el = document.createElement('div');
  el.className = 'toast' + (type==='err'?' err':type==='warn'?' warn':'');
  el.innerHTML = (type==='err'?'✖ ':type==='warn'?'⚠ ':'✓ ') + msg;
  document.getElementById('toastWrap').appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(),300); }, 3400);
}
function badge(status){
  const map = {
    Approved:'b-approved', Completed:'b-completed', Active:'b-active',
    Pending:'b-pending', "In Progress":'b-progress', Rejected:'b-rejected', Inactive:'b-inactive',
  };
  return `<span class="badge ${map[status]||'b-gray'}">${status}</span>`;
}
function studentById(id){ return state.students.find(s=>s.id===id); }
function initialsOf(name){
  const letters = (name||'').replace(/[^a-zA-Z ]/g,'').trim();
  if(!letters) return 'NA';
  return letters.split(' ').filter(Boolean).map(w=>w[0].toUpperCase()).slice(0,2).join('');
}
function computeOverallStatus(clearance){
  const vals = Object.values(clearance);
  if(vals.every(v=>v==='Approved')) return 'Completed';
  if(vals.some(v=>v==='Rejected')) return 'Rejected';
  if(vals.some(v=>v==='Approved')) return 'In Progress';
  return 'Pending';
}
function unreadNotifCount(){ return state.notifications.filter(n=>!n.read).length; }

/* ---------------- NAV CONFIG ---------------- */
const NAV = [
  {group:"General", items:[{p:'dashboard', ic:'🏠', label:'Home'}]},
  {group:"Clearance Management", items:[
    {p:'clearance', ic:'📋', label:'Student Clearance'},
    {p:'students', ic:'🎓', label:'Students'},
    {p:'departments', ic:'🏢', label:'Departments/Offices'},
    {p:'requirements', ic:'📄', label:'Requirements'},
    {p:'deadline', ic:'⏰', label:'Set Deadline'},
  ]},
  {group:"Reports", items:[
    {p:'reports', ic:'📊', label:'Clearance Reports'},
    {p:'cleared', ic:'✅', label:'Cleared Students'},
    {p:'pending', ic:'⏳', label:'Pending Clearance'},
    {p:'rejected', ic:'❌', label:'Rejected Clearance'},
  ]},
  {group:"System", items:[
    {p:'adminusers', ic:'👤', label:'Admin Users'},
    {p:'settings', ic:'⚙️', label:'Settings'},
    {p:'logout', ic:'🚪', label:'Logout'},
  ]},
];
const TITLES = {
  dashboard:['Admin Dashboard','Monitor and manage student clearance requests across all departments.'],
  clearance:['Student Clearance','Review and process clearance requests from every office.'],
  students:['Students','Manage student accounts and their clearance status.'],
  departments:['Departments & Offices','Manage the offices involved in the clearance workflow.'],
  requirements:['Clearance Requirements','Configure the requirements each office checks for.'],
  deadline:['Clearance Deadline','Set the submission window for the current school year.'],
  reports:['Clearance Reports','A full overview of clearance activity across the school.'],
  cleared:['Cleared Students','Students who have completed every clearance requirement.'],
  pending:['Pending Clearance','Students still missing one or more requirements.'],
  rejected:['Rejected Clearance','Requests that were rejected and need student action.'],
  adminusers:['Admin Users & Faculty','Manage administrator accounts and faculty/staff records.'],
  settings:['Settings','System preferences and demo data controls.'],
};

/* =========================================================================
   RENDER ROOT
   ========================================================================= */
function render(){
  persist();
  const app = document.getElementById('app');
  app.innerHTML = renderShell();
  attachEvents();
}

function renderShell(){
  const collapsedCls = state.sidebarCollapsed ? 'collapsed' : '';
  const mobileCls = state.sidebarMobileOpen ? 'mobile-open' : '';
  return `
  <div class="sidebar ${collapsedCls} ${mobileCls}" id="sidebar">
    <div class="sb-head">
      <div class="sb-logo"><img src="${LOGO_ICON}" alt="Eclaro Academy"></div>
      <div class="sb-name">Eclaro Academy<span>Admin Console</span></div>
    </div>
    <div class="sb-profile">
      <div class="sb-avatar">${initialsOf(state.admins[0]?.name)}</div>
      <span class="wl">Welcome,</span>
      <b>${state.admins[0]?.name || 'Admin'}</b>
    </div>
    <nav class="sb-nav">
      ${NAV.map(g=>`
        <div class="sb-group-label">${state.sidebarCollapsed?'•':g.group}</div>
        ${g.items.map(it=>`<a href="#" class="sb-link ${state.page===it.p?'active':''}" data-page="${it.p}" data-tip="${it.label}">
          <span class="ic">${it.ic}</span><span class="lbl">${it.label}</span>
        </a>`).join('')}
      `).join('')}
    </nav>
    <div class="sb-foot">
      <a href="index.html" class="sb-link" data-tip="Back to Main Portal">
        <span class="ic">↩️</span><span class="lbl">Back to Main Portal</span>
      </a>
    </div>
  </div>

  <div class="main ${collapsedCls}" id="mainArea">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="icon-btn" id="hamburgerBtn">☰</button>
        <h2 style="font-size:16px;">${TITLES[state.page] ? TITLES[state.page][0] : ''}</h2>
      </div>
      <div class="topbar-right">
        <a href="index.html" class="btn btn-outline btn-sm">🏠 Clearance Homepage</a>
        <div class="dropdown">
          <button class="icon-btn" id="notifBtn">🔔${unreadNotifCount()>0?`<span class="icon-dot">${unreadNotifCount()}</span>`:''}</button>
          <div class="dd-panel notif-panel hidden" id="notifPanel">
            <div class="dd-head">Notifications <button id="markAllReadBtn">Mark all as read</button></div>
            <div class="notif-list">
              ${state.notifications.length ? state.notifications.map(n=>`
                <div class="notif-item ${n.read?'read':''}"><div class="dot"></div>
                  <div><b>${n.title}</b><p>${n.text}</p><span>${n.time}</span></div>
                </div>`).join('') : `<div class="empty" style="padding:26px;"><div class="ic">🔔</div><p>No notifications</p></div>`}
            </div>
          </div>
        </div>
        <div class="dropdown">
          <button class="profile-chip" id="profileBtn">
            <div class="avatar-sm">${initialsOf(state.admins[0]?.name)}</div>
            <div><div class="nm">${state.admins[0]?.name||'Admin'}</div><div class="car">${state.admins[0]?.role||'Administrator'}</div></div>
            <span style="font-size:10px;color:var(--ink-soft);">▼</span>
          </button>
          <div class="dd-panel profile-panel hidden" id="profilePanel">
            <div class="pp-head"><b>${state.admins[0]?.name||'Admin'}</b><span>Administrator</span></div>
            <a href="#" class="pp-link" id="viewProfileBtn">👤 View Profile</a>
            <a href="#" class="pp-link" data-page="settings" id="acctSettingsBtn">⚙️ Account Settings</a>
            <a href="#" class="pp-link danger" id="logoutBtn2">🚪 Logout</a>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      ${state.page==='logout' ? renderLogout() : renderPage()}
    </div>
  </div>
  `;
}

function renderPage(){
  switch(state.page){
    case 'dashboard': return pageDashboard();
    case 'clearance': return pageClearance();
    case 'students': return pageStudents();
    case 'departments': return pageDepartments();
    case 'requirements': return pageRequirements();
    case 'deadline': return pageDeadline();
    case 'reports': return pageReports();
    case 'cleared': return pageCleared();
    case 'pending': return pagePending();
    case 'rejected': return pageRejected();
    case 'adminusers': return pageAdminUsers();
    case 'settings': return pageSettings();
    default: return pageDashboard();
  }
}

/* =========================================================================
   PAGE: DASHBOARD
   ========================================================================= */
function pageDashboard(){
  const total = state.students.length;
  const pending = state.students.filter(s=>s.status==='Pending').length;
  const completed = state.students.filter(s=>s.status==='Completed').length;
  const rejected = state.students.filter(s=>s.status==='Rejected').length;
  const inprogress = state.students.filter(s=>s.status==='In Progress').length;
  const pct = n => total ? Math.round(n/total*100) : 0;

  return `
  <div class="page-head"><h2>${TITLES.dashboard[0]}</h2><p>${TITLES.dashboard[1]}</p></div>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-top"><div class="stat-ic" style="background:var(--navy-100);color:var(--navy-700);">🎓</div><span class="stat-change" style="background:var(--success-light);color:var(--success);">Live</span></div><b>${total.toLocaleString()}</b><span>Total Students</span></div>
    <div class="stat-card"><div class="stat-top"><div class="stat-ic" style="background:var(--warning-light);color:var(--warning);">⏳</div><span class="stat-change" style="background:var(--warning-light);color:var(--warning);">${pct(pending)}%</span></div><b>${pending.toLocaleString()}</b><span>Pending Clearance</span></div>
    <div class="stat-card"><div class="stat-top"><div class="stat-ic" style="background:var(--success-light);color:var(--success);">✅</div><span class="stat-change" style="background:var(--success-light);color:var(--success);">${pct(completed)}%</span></div><b>${completed.toLocaleString()}</b><span>Completed Clearance</span></div>
    <div class="stat-card"><div class="stat-top"><div class="stat-ic" style="background:var(--danger-light);color:var(--danger);">✖</div><span class="stat-change" style="background:var(--danger-light);color:var(--danger);">${pct(rejected)}%</span></div><b>${rejected.toLocaleString()}</b><span>Rejected</span></div>
  </div>

  <div class="grid2" style="align-items:flex-start;">
    <div class="card card-pad">
      <h3 style="margin-bottom:18px;">Clearance Overview</h3>
      <div class="bar-row"><div class="lbl">Completed</div><div class="bar-track"><div class="bar-fill" style="width:${pct(completed)}%;background:var(--success);"></div></div><div class="val">${pct(completed)}%</div></div>
      <div class="bar-row"><div class="lbl">In Progress</div><div class="bar-track"><div class="bar-fill" style="width:${pct(inprogress)}%;background:var(--info);"></div></div><div class="val">${pct(inprogress)}%</div></div>
      <div class="bar-row"><div class="lbl">Pending</div><div class="bar-track"><div class="bar-fill" style="width:${pct(pending)}%;background:var(--warning);"></div></div><div class="val">${pct(pending)}%</div></div>
      <div class="bar-row"><div class="lbl">Rejected</div><div class="bar-track"><div class="bar-fill" style="width:${pct(rejected)}%;background:var(--danger);"></div></div><div class="val">${pct(rejected)}%</div></div>
    </div>
    <div class="card card-pad">
      <h3 style="margin-bottom:14px;">Recent Clearance Requests</h3>
      ${state.clearanceRequests.slice(0,4).map(r=>{
        const s = studentById(r.studentId);
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--paper-2);">
          <div><b style="font-size:13px;">${s?s.name:r.studentId}</b><div class="cell-sub mono">${r.requestId} · ${r.currentOffice}</div></div>
          ${badge(r.status)}
        </div>`;
      }).join('') || `<div class="empty"><p>No recent requests.</p></div>`}
    </div>
  </div>

  <div class="row-between" style="margin-top:24px;"><h3>Student Clearance List</h3><a href="#" class="btn btn-outline btn-sm" data-page="students">View all →</a></div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Grade</th><th>Status</th></tr></thead>
      <tbody>${state.students.slice(0,5).map(s=>`<tr><td class="mono cell-sub">${s.id}</td><td class="cell-main">${s.name}</td><td>${s.department}</td><td>${s.grade}</td><td>${badge(s.status)}</td></tr>`).join('')}</tbody>
    </table>
  </div>
  `;
}

/* =========================================================================
   PAGE: STUDENTS
   ========================================================================= */
function filteredStudents(){
  const q = state.search.toLowerCase();
  return state.students.filter(s=>{
    const matchQ = !q || s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.section.toLowerCase().includes(q);
    const matchStatus = !state.filters.status || s.status===state.filters.status;
    const matchDept = !state.filters.department || s.department===state.filters.department;
    const matchGrade = !state.filters.grade || s.grade===state.filters.grade;
    return matchQ && matchStatus && matchDept && matchGrade;
  });
}
function pageStudents(){
  return `
  <div class="page-head"><h2>${TITLES.students[0]}</h2><p>${TITLES.students[1]}</p></div>
  <div class="row-between">
    <h3>Student Clearance List</h3>
    <div class="action-cluster">
      <button class="btn btn-outline btn-sm" id="exportStudentsBtn">⬇ Export</button>
      <button class="btn btn-primary btn-sm" id="addStudentBtn">+ Add Student</button>
    </div>
  </div>
  <div class="filters-bar">
    <div class="search-wrap"><span>🔎</span><input id="studentSearchInput" placeholder="Search students..." value="${state.search}"></div>
    <select id="statusFilterSel">
      <option value="">All Statuses</option>
      ${['Pending','In Progress','Approved','Completed','Rejected'].map(s=>`<option ${state.filters.status===s?'selected':''}>${s}</option>`).join('')}
    </select>
    <select id="deptFilterSel">
      <option value="">All Departments</option>
      ${DEPARTMENTS.map(d=>`<option ${state.filters.department===d?'selected':''}>${d}</option>`).join('')}
    </select>
    <select id="gradeFilterSel">
      <option value="">All Grades</option>
      <option ${state.filters.grade==='Grade 11'?'selected':''}>Grade 11</option>
      <option ${state.filters.grade==='Grade 12'?'selected':''}>Grade 12</option>
    </select>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Contact</th><th>Department</th><th>Grade</th><th>Section</th><th>Status</th><th>Account</th><th>Action</th></tr></thead>
      <tbody id="studentsTbody">${renderStudentRows()}</tbody>
    </table>
  </div>`;
}
function renderStudentRows(){
  const list = filteredStudents();
  if(!list.length) return `<tr><td colspan="10"><div class="empty"><div class="ic">🔍</div><h4>No students found</h4><p>Try adjusting your search or filters.</p></div></td></tr>`;
  return list.map(s=>`<tr>
    <td class="mono cell-sub">${s.id}</td><td class="cell-main">${s.name}</td><td class="cell-sub">${s.email}</td><td class="cell-sub">${s.contact}</td>
    <td>${s.department}</td><td>${s.grade}</td><td>${s.section}</td><td>${badge(s.status)}</td><td>${badge(s.accountStatus)}</td>
    <td><div class="act-cell">
      <button class="btn btn-info btn-xs" data-action="view-student" data-id="${s.id}">👁 View</button>
      <button class="btn btn-success btn-xs" data-action="edit-student" data-id="${s.id}">✏ Edit</button>
      <button class="btn btn-danger btn-xs" data-action="deactivate-student" data-id="${s.id}" ${s.accountStatus==='Inactive'?'disabled':''}>✖ Deactivate</button>
    </div></td>
  </tr>`).join('');
}

/* =========================================================================
   PAGE: STUDENT CLEARANCE (requests queue)
   ========================================================================= */
function pageClearance(){
  return `
  <div class="page-head"><h2>${TITLES.clearance[0]}</h2><p>${TITLES.clearance[1]}</p></div>
  <div class="row-between"><h3>Clearance Requests</h3><span class="badge b-progress">${state.clearanceRequests.filter(r=>r.status==='Pending').length} pending</span></div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Request ID</th><th>Student</th><th>Department</th><th>Date Submitted</th><th>Current Office</th><th>Status</th><th>Action</th></tr></thead>
      <tbody id="clearanceTbody">${renderClearanceRows()}</tbody>
    </table>
  </div>`;
}
function renderClearanceRows(){
  if(!state.clearanceRequests.length) return `<tr><td colspan="7"><div class="empty"><div class="ic">📭</div><h4>No clearance requests</h4></div></td></tr>`;
  return state.clearanceRequests.map(r=>{
    const s = studentById(r.studentId);
    return `<tr>
      <td class="mono cell-sub">${r.requestId}</td>
      <td class="cell-main">${s?s.name:r.studentId}<br><span class="cell-sub mono">${r.studentId}</span></td>
      <td>${r.department}</td><td>${r.dateSubmitted}</td>
      <td>${OFFICE_ICON[r.currentOffice]||''} ${r.currentOffice}</td>
      <td>${badge(r.status)}</td>
      <td><div class="act-cell">
        <button class="btn btn-info btn-xs" data-action="view-request" data-id="${r.requestId}">👁 View</button>
        <button class="btn btn-success btn-xs" data-action="approve-request" data-id="${r.requestId}" ${r.status!=='Pending'?'disabled':''}>✓ Approve</button>
        <button class="btn btn-danger btn-xs" data-action="reject-request" data-id="${r.requestId}" ${r.status!=='Pending'?'disabled':''}>✖ Reject</button>
      </div></td>
    </tr>`;
  }).join('');
}

/* =========================================================================
   PAGE: DEPARTMENTS
   ========================================================================= */
function pageDepartments(){
  return `
  <div class="page-head"><h2>${TITLES.departments[0]}</h2><p>${TITLES.departments[1]}</p></div>
  <div class="row-between"><h3>Offices</h3><button class="btn btn-primary btn-sm" id="addOfficeBtn">+ Add Office</button></div>
  <div class="grid3" id="deptGrid">${renderDeptCards()}</div>`;
}
function renderDeptCards(){
  return state.offices.map(o=>{
    const load = state.students.filter(s=>Object.keys(s.clearance||{}).length && s.clearance[o.name]==='Pending').length;
    return `<div class="dept-card">
      <div class="ic">${OFFICE_ICON[o.name]||'🏢'}</div>
      <h4>${o.name}</h4>
      <div class="n">${load} pending review(s) · ${badge(o.status)}</div>
      <div class="row">
        <button class="btn btn-outline btn-xs" data-action="edit-office" data-name="${o.name}">✏ Edit</button>
        <button class="btn btn-danger btn-xs" data-action="toggle-office" data-name="${o.name}">${o.status==='Active'?'✖ Deactivate':'✓ Activate'}</button>
      </div>
    </div>`;
  }).join('');
}

/* =========================================================================
   PAGE: REQUIREMENTS
   ========================================================================= */
function pageRequirements(){
  return `
  <div class="page-head"><h2>${TITLES.requirements[0]}</h2><p>${TITLES.requirements[1]}</p></div>
  <div class="row-between"><h3>Clearance Requirements</h3><button class="btn btn-primary btn-sm" id="addRequirementBtn">+ Add Requirement</button></div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Office</th><th>Requirement</th><th>Required</th><th>Status</th><th>Action</th></tr></thead>
      <tbody id="reqTbody">${renderRequirementRows()}</tbody>
    </table>
  </div>`;
}
function renderRequirementRows(){
  if(!state.requirements.length) return `<tr><td colspan="5"><div class="empty"><p>No requirements configured.</p></div></td></tr>`;
  return state.requirements.map((r,i)=>`<tr>
    <td class="cell-main">${OFFICE_ICON[r.office]||''} ${r.office}</td><td>${r.requirement}</td><td>${r.required}</td><td>${badge(r.status)}</td>
    <td><div class="act-cell">
      <button class="btn btn-success btn-xs" data-action="edit-req" data-i="${i}">✏ Edit</button>
      <button class="btn btn-danger btn-xs" data-action="toggle-req" data-i="${i}">${r.status==='Active'?'✖ Deactivate':'✓ Activate'}</button>
    </div></td>
  </tr>`).join('');
}

/* =========================================================================
   PAGE: DEADLINE
   ========================================================================= */
function pageDeadline(){
  const d = state.deadline;
  const fmt = (iso)=>{ if(!iso) return '—'; const dt = new Date(iso+'T00:00:00'); return dt.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}); };
  return `
  <div class="page-head"><h2>${TITLES.deadline[0]}</h2><p>${TITLES.deadline[1]}</p></div>
  <div class="deadline-hero">
    <span>Current Deadline · SY ${d.schoolYear}</span>
    <h2>${fmt(d.end)}</h2>
  </div>
  <div class="card card-pad" style="max-width:520px;">
    <h3 style="margin-bottom:16px;">Update Deadline</h3>
    <form id="deadlineForm">
      <div class="field"><label>School Year</label>
        <select id="dlYear">
          <option ${d.schoolYear==='2025-2026'?'selected':''}>2025-2026</option>
          <option ${d.schoolYear==='2026-2027'?'selected':''}>2026-2027</option>
        </select>
      </div>
      <div class="grid2">
        <div class="field"><label>Start Date</label><input type="date" id="dlStart" value="${d.start}" required></div>
        <div class="field"><label>Deadline Date</label><input type="date" id="dlEnd" value="${d.end}" required></div>
      </div>
      <button class="btn btn-primary btn-block" type="submit">Save Deadline</button>
    </form>
  </div>`;
}

/* =========================================================================
   PAGE: REPORTS
   ========================================================================= */
function pageReports(){
  const list = state.students.filter(s=>{
    const rf = state.reportFilters;
    return (!rf.department||s.department===rf.department) && (!rf.grade||s.grade===rf.grade);
  });
  const total = list.length;
  const completed = list.filter(s=>s.status==='Completed').length;
  const pending = list.filter(s=>s.status==='Pending').length;
  const inprogress = list.filter(s=>s.status==='In Progress').length;
  const rejected = list.filter(s=>s.status==='Rejected').length;
  const rate = total? Math.round(completed/total*100) : 0;
  const deptBars = DEPARTMENTS.map(d=>({l:d, v: list.filter(s=>s.department===d).length}));
  const maxDept = Math.max(1, ...deptBars.map(b=>b.v));

  return `
  <div class="page-head no-print"><h2>${TITLES.reports[0]}</h2><p>${TITLES.reports[1]}</p></div>
  <div class="filters-bar no-print">
    <select id="rfYear"><option>2025-2026</option><option>2024-2025</option></select>
    <select id="rfDept"><option value="">All Departments</option>${DEPARTMENTS.map(d=>`<option ${state.reportFilters.department===d?'selected':''}>${d}</option>`).join('')}</select>
    <select id="rfGrade"><option value="">All Grades</option><option ${state.reportFilters.grade==='Grade 11'?'selected':''}>Grade 11</option><option ${state.reportFilters.grade==='Grade 12'?'selected':''}>Grade 12</option></select>
    <select id="rfSection"><option value="">All Sections</option></select>
    <button class="btn btn-outline btn-sm" id="printReportBtn" style="margin-left:auto;">🖨 Print Report</button>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><b>${total}</b><span>Total Students</span></div>
    <div class="stat-card"><b>${total}</b><span>Total Clearance Requests</span></div>
    <div class="stat-card"><b>${completed}</b><span>Completed</span></div>
    <div class="stat-card"><b>${rate}%</b><span>Completion Percentage</span></div>
  </div>
  <div class="grid2">
    <div class="card card-pad">
      <h3 style="margin-bottom:16px;">Requests by Status</h3>
      <div class="bar-row"><div class="lbl">Completed</div><div class="bar-track"><div class="bar-fill" style="width:${total?completed/total*100:0}%;background:var(--success);"></div></div><div class="val">${completed}</div></div>
      <div class="bar-row"><div class="lbl">In Progress</div><div class="bar-track"><div class="bar-fill" style="width:${total?inprogress/total*100:0}%;background:var(--info);"></div></div><div class="val">${inprogress}</div></div>
      <div class="bar-row"><div class="lbl">Pending</div><div class="bar-track"><div class="bar-fill" style="width:${total?pending/total*100:0}%;background:var(--warning);"></div></div><div class="val">${pending}</div></div>
      <div class="bar-row"><div class="lbl">Rejected</div><div class="bar-track"><div class="bar-fill" style="width:${total?rejected/total*100:0}%;background:var(--danger);"></div></div><div class="val">${rejected}</div></div>
    </div>
    <div class="card card-pad">
      <h3 style="margin-bottom:16px;">Students by Department</h3>
      ${deptBars.map(b=>`<div class="bar-row"><div class="lbl">${b.l}</div><div class="bar-track"><div class="bar-fill" style="width:${b.v/maxDept*100}%;background:var(--olive);"></div></div><div class="val">${b.v}</div></div>`).join('')}
    </div>
  </div>`;
}

/* =========================================================================
   PAGE: CLEARED / PENDING / REJECTED
   ========================================================================= */
function pageCleared(){
  const list = state.students.filter(s=>s.status==='Completed');
  return `
  <div class="page-head"><h2>${TITLES.cleared[0]}</h2><p>${TITLES.cleared[1]}</p></div>
  <div class="card table-wrap">
    <table><thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Grade</th><th>Section</th><th>Completion Date</th><th>Action</th></tr></thead>
    <tbody>${list.length? list.map(s=>`<tr>
      <td class="mono cell-sub">${s.id}</td><td class="cell-main">${s.name}</td><td>${s.department}</td><td>${s.grade}</td><td>${s.section}</td><td>${s.dateCompleted||'—'}</td>
      <td><div class="act-cell">
        <button class="btn btn-info btn-xs" data-action="view-student" data-id="${s.id}">👁 View Clearance</button>
        <button class="btn btn-outline btn-xs" data-action="print-clearance" data-id="${s.id}">🖨 Print</button>
      </div></td>
    </tr>`).join('') : `<tr><td colspan="7"><div class="empty"><div class="ic">✅</div><h4>No completed clearances yet</h4></div></td></tr>`}</tbody></table>
  </div>`;
}
function pagePending(){
  const list = state.students.filter(s=>s.status==='Pending' || s.status==='In Progress');
  return `
  <div class="page-head"><h2>${TITLES.pending[0]}</h2><p>${TITLES.pending[1]}</p></div>
  <div class="card table-wrap">
    <table><thead><tr><th>Student</th><th>Missing Office(s)</th><th>Current Status</th><th>Date Submitted</th><th>Action</th></tr></thead>
    <tbody>${list.length? list.map(s=>{
      const missing = Object.entries(s.clearance).filter(([o,st])=>st!=='Approved').map(([o])=>o);
      return `<tr>
        <td class="cell-main">${s.name}<br><span class="cell-sub mono">${s.id}</span></td>
        <td class="cell-sub">${missing.join(', ')||'—'}</td>
        <td>${badge(s.status)}</td><td>${s.dateSubmitted}</td>
        <td><button class="btn btn-info btn-xs" data-action="view-student" data-id="${s.id}">👁 View Details</button></td>
      </tr>`;
    }).join('') : `<tr><td colspan="5"><div class="empty"><div class="ic">⏳</div><h4>Nothing pending</h4></div></td></tr>`}</tbody></table>
  </div>`;
}
function pageRejected(){
  const list = state.students.filter(s=>s.status==='Rejected');
  return `
  <div class="page-head"><h2>${TITLES.rejected[0]}</h2><p>${TITLES.rejected[1]}</p></div>
  <div class="card table-wrap">
    <table><thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Reason</th><th>Action</th></tr></thead>
    <tbody>${list.length? list.map(s=>`<tr>
      <td class="mono cell-sub">${s.id}</td><td class="cell-main">${s.name}</td><td>${s.department}</td><td class="cell-sub">${s.rejectReason||'—'}</td>
      <td><button class="btn btn-info btn-xs" data-action="view-student" data-id="${s.id}">👁 View</button></td>
    </tr>`).join('') : `<tr><td colspan="5"><div class="empty"><div class="ic">❌</div><h4>No rejected clearances</h4></div></td></tr>`}</tbody></table>
  </div>`;
}

/* =========================================================================
   PAGE: ADMIN USERS + FACULTY (tabs)
   ========================================================================= */
let adminUsersTab = 'admins';
function pageAdminUsers(){
  return `
  <div class="page-head"><h2>${TITLES.adminusers[0]}</h2><p>${TITLES.adminusers[1]}</p></div>
  <div class="tabs">
    <button class="tab-btn ${adminUsersTab==='admins'?'active':''}" data-tab="admins">Admin Users</button>
    <button class="tab-btn ${adminUsersTab==='faculty'?'active':''}" data-tab="faculty">Faculty / Staff</button>
  </div>
  ${adminUsersTab==='admins' ? `
    <div class="row-between"><h3>Administrator Accounts</h3><button class="btn btn-primary btn-sm" id="addAdminBtn">+ Add Admin User</button></div>
    <div class="card table-wrap"><table>
      <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
      <tbody>${state.admins.map(a=>`<tr><td class="cell-main">${a.name}</td><td class="mono cell-sub">${a.username}</td><td class="cell-sub">${a.email}</td><td>${badge('Active')} ${a.role}</td></tr>`).join('')}</tbody>
    </table></div>
  ` : `
    <div class="row-between"><h3>Faculty & Staff</h3><button class="btn btn-primary btn-sm" id="addFacultyBtn">+ Add Faculty</button></div>
    <div class="card table-wrap"><table>
      <thead><tr><th>Employee ID</th><th>Name</th><th>Email</th><th>Contact</th><th>Department</th><th>Designation</th><th>Employment</th></tr></thead>
      <tbody>${state.faculty.length? state.faculty.map(f=>`<tr><td class="mono cell-sub">${f.empId}</td><td class="cell-main">${f.name}</td><td class="cell-sub">${f.email}</td><td class="cell-sub">${f.contact}</td><td>${f.department}</td><td>${f.designation}</td><td>${badge('Active')} ${f.employment}</td></tr>`).join('') : `<tr><td colspan="7"><div class="empty"><p>No faculty records yet.</p></div></td></tr>`}</tbody>
    </table></div>
  `}`;
}

/* =========================================================================
   PAGE: SETTINGS
   ========================================================================= */
function pageSettings(){
  return `
  <div class="page-head"><h2>${TITLES.settings[0]}</h2><p>${TITLES.settings[1]}</p></div>
  <div class="card card-pad" style="max-width:520px;margin-bottom:18px;">
    <h3 style="margin-bottom:14px;">Account</h3>
    <div class="kv" style="grid-template-columns:1fr;">
      <div><span>Administrator</span><b>${state.admins[0]?.name}</b></div>
      <div><span>Email</span><b>${state.admins[0]?.email}</b></div>
    </div>
  </div>
  <div class="card card-pad" style="max-width:520px;border-color:var(--danger-light);">
    <h3 style="margin-bottom:6px;color:var(--danger);">Reset Demo Data</h3>
    <p class="cell-sub" style="margin-bottom:14px;">This clears everything you've changed and restores the original demo dataset. This cannot be undone.</p>
    <button class="btn btn-danger" id="resetDataBtn">Reset Demo Data</button>
  </div>`;
}

function renderLogout(){
  return `<div class="empty" style="padding:100px 20px;">
    <div class="ic">🚪</div><h4>You have been logged out</h4><p style="margin-bottom:16px;">This is a front-end demo — no real session was active.</p>
    <button class="btn btn-primary" id="backToDashBtn">Return to Dashboard</button>
  </div>`;
}

/* =========================================================================
   MODALS
   ========================================================================= */
function openModal(html, wide){
  document.getElementById('modalRoot').innerHTML = `<div class="modal-bg" id="modalBg"><div class="modal ${wide?'wide':''}">${html}</div></div>`;
}
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }

function modalAddStudent(){
  openModal(`
    <div class="modal-head"><h3>Add Student</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <form id="addStudentForm">
        <div class="grid2">
          <div class="field"><label>Student ID</label><input id="asId" required></div>
          <div class="field"><label>Full Name</label><input id="asName" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Email</label><input type="email" id="asEmail" required></div>
          <div class="field"><label>Contact Number</label><input id="asContact" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Department</label><select id="asDept">${DEPARTMENTS.map(d=>`<option>${d}</option>`).join('')}</select></div>
          <div class="field"><label>Grade/Year</label><select id="asGrade"><option>Grade 11</option><option>Grade 12</option></select></div>
        </div>
        <div class="field"><label>Section</label><input id="asSection" required></div>
        <div class="field-err-msg show" id="asErr" style="display:none;">Please complete all required fields.</div>
      </form>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="asSubmit">Add Student</button></div>
  `);
}

function modalEditStudent(id){
  const s = studentById(id); if(!s) return;
  openModal(`
    <div class="modal-head"><h3>Edit Student</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <form id="editStudentForm">
        <div class="field"><label>Full Name</label><input id="esName" value="${s.name}" required></div>
        <div class="grid2">
          <div class="field"><label>Email</label><input type="email" id="esEmail" value="${s.email}" required></div>
          <div class="field"><label>Contact Number</label><input id="esContact" value="${s.contact}" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Department</label><select id="esDept">${DEPARTMENTS.map(d=>`<option ${d===s.department?'selected':''}>${d}</option>`).join('')}</select></div>
          <div class="field"><label>Grade/Year</label><select id="esGrade"><option ${s.grade==='Grade 11'?'selected':''}>Grade 11</option><option ${s.grade==='Grade 12'?'selected':''}>Grade 12</option></select></div>
        </div>
        <div class="field"><label>Section</label><input id="esSection" value="${s.section}" required></div>
      </form>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="esSubmit" data-id="${id}">Save Changes</button></div>
  `);
}

function modalViewStudent(id){
  const s = studentById(id); if(!s) return;
  const reqRows = Object.entries(s.clearance).map(([o,st])=>`<div class="req-mini-row"><span>${OFFICE_ICON[o]||''} ${o}</span>${badge(st)}</div>`).join('');
  openModal(`
    <div class="modal-head"><h3>Student Clearance Details</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <div class="section-sub">Student Information</div>
      <div class="kv">
        <div><span>ID Number</span><b class="mono">${s.id}</b></div><div><span>Status</span><b>${badge(s.status)}</b></div>
        <div><span>Name</span><b>${s.name}</b></div><div><span>Email</span><b>${s.email}</b></div>
        <div><span>Contact</span><b>${s.contact}</b></div><div><span>Department</span><b>${s.department}</b></div>
        <div><span>Grade/Year</span><b>${s.grade}</b></div><div><span>Section</span><b>${s.section}</b></div>
      </div>
      <div class="section-sub">Clearance Requirements</div>
      ${reqRows}
      ${s.rejectReason? `<div class="section-sub">Rejection Reason</div><p style="font-size:13px;color:var(--ink-soft);">${s.rejectReason}</p>`:''}
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Close</button></div>
  `, true);
}

function modalDeactivateStudent(id){
  const s = studentById(id); if(!s) return;
  openModal(`
    <div class="modal-body" style="text-align:center;padding-top:28px;">
      <div style="font-size:36px;margin-bottom:10px;">⚠️</div>
      <h3 style="margin-bottom:6px;">Are you sure you want to deactivate this student?</h3>
      <p class="cell-sub">${s.name} (${s.id}) will be marked Inactive. Their record will not be deleted.</p>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-danger" id="confirmDeactivate" data-id="${id}">Deactivate</button></div>
  `);
}

function modalAddAdmin(){
  openModal(`
    <div class="modal-head"><h3>Add Admin User</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <form id="addAdminForm">
        <div class="field"><label>Full Name</label><input id="aaName" required></div>
        <div class="grid2">
          <div class="field"><label>Username</label><input id="aaUser" required></div>
          <div class="field"><label>Email</label><input type="email" id="aaEmail" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Password</label><input type="password" id="aaPass" required></div>
          <div class="field"><label>Role</label><select id="aaRole"><option>Administrator</option><option>Super Admin</option><option>Moderator</option></select></div>
        </div>
      </form>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="aaSubmit">Create Admin</button></div>
  `);
}

function modalAddFaculty(){
  openModal(`
    <div class="modal-head"><h3>Add Faculty</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <form id="addFacultyForm">
        <div class="grid2">
          <div class="field"><label>Employee ID</label><input id="afId" required></div>
          <div class="field"><label>Full Name</label><input id="afName" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Email</label><input type="email" id="afEmail" required></div>
          <div class="field"><label>Contact Number</label><input id="afContact" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Department</label><select id="afDept">${OFFICES.map(o=>`<option>${o}</option>`).join('')}</select></div>
          <div class="field"><label>Designation</label><input id="afDesig" placeholder="e.g. Office Staff" required></div>
        </div>
        <div class="grid2">
          <div class="field"><label>Campus</label><input id="afCampus" value="Main Campus" required></div>
          <div class="field"><label>Employment Type</label>
            <div class="radio-row" style="margin-top:10px;">
              <label><input type="radio" name="afEmp" value="Permanent" checked> Permanent</label>
              <label><input type="radio" name="afEmp" value="Part-time"> Part-time</label>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="afSubmit">Add Faculty</button></div>
  `, true);
}

function modalViewRequest(reqId){
  const r = state.clearanceRequests.find(x=>x.requestId===reqId); if(!r) return;
  const s = studentById(r.studentId);
  openModal(`
    <div class="modal-head"><h3>${r.requestId}</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <div class="kv">
        <div><span>Student</span><b>${s?s.name:r.studentId}</b></div><div><span>ID</span><b class="mono">${r.studentId}</b></div>
        <div><span>Department</span><b>${r.department}</b></div><div><span>Current Office</span><b>${r.currentOffice}</b></div>
        <div><span>Date Submitted</span><b>${r.dateSubmitted}</b></div><div><span>Status</span><b>${badge(r.status)}</b></div>
      </div>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Close</button></div>
  `);
}

function modalApproveRequest(reqId){
  openModal(`
    <div class="modal-body" style="text-align:center;padding-top:28px;">
      <div style="font-size:36px;margin-bottom:10px;">✅</div>
      <h3 style="margin-bottom:6px;">Approve this clearance requirement?</h3>
      <p class="cell-sub">This will mark the current office's requirement as approved for this student.</p>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-success" id="confirmApprove" data-id="${reqId}">Approve</button></div>
  `);
}

function modalRejectRequest(reqId){
  openModal(`
    <div class="modal-head"><h3>Reject Clearance</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <div class="field"><label>Reason for rejection</label><textarea id="rejectReason" rows="3" placeholder="Explain what the student needs to resolve..." required></textarea></div>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-danger" id="confirmReject" data-id="${reqId}">Reject Clearance</button></div>
  `);
}

function modalAddOffice(){
  openModal(`
    <div class="modal-head"><h3>Add Office</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body"><form id="addOfficeForm"><div class="field"><label>Office Name</label><input id="aoName" required></div></form></div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="aoSubmit">Add Office</button></div>
  `);
}
function modalEditOffice(name){
  openModal(`
    <div class="modal-head"><h3>Edit Office</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body"><form id="editOfficeForm"><div class="field"><label>Office Name</label><input id="eoName" value="${name}" required></div></form></div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="eoSubmit" data-orig="${name}">Save Changes</button></div>
  `);
}

function modalAddRequirement(){
  openModal(`
    <div class="modal-head"><h3>Add Requirement</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <form id="addReqForm">
        <div class="field"><label>Office</label><select id="arOffice">${OFFICES.map(o=>`<option>${o}</option>`).join('')}</select></div>
        <div class="field"><label>Requirement</label><input id="arName" required></div>
        <div class="field"><label>Required</label><select id="arRequired"><option>Yes</option><option>No</option></select></div>
      </form>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="arSubmit">Add Requirement</button></div>
  `);
}
function modalEditRequirement(i){
  const r = state.requirements[i]; if(!r) return;
  openModal(`
    <div class="modal-head"><h3>Edit Requirement</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body">
      <form id="editReqForm">
        <div class="field"><label>Office</label><select id="erOffice">${OFFICES.map(o=>`<option ${o===r.office?'selected':''}>${o}</option>`).join('')}</select></div>
        <div class="field"><label>Requirement</label><input id="erName" value="${r.requirement}" required></div>
        <div class="field"><label>Required</label><select id="erRequired"><option ${r.required==='Yes'?'selected':''}>Yes</option><option ${r.required==='No'?'selected':''}>No</option></select></div>
      </form>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-primary" id="erSubmit" data-i="${i}">Save Changes</button></div>
  `);
}

function modalConfirmReset(){
  openModal(`
    <div class="modal-body" style="text-align:center;padding-top:28px;">
      <div style="font-size:36px;margin-bottom:10px;">⚠️</div>
      <h3 style="margin-bottom:6px;">Reset all demo data?</h3>
      <p class="cell-sub">Every change you've made will be permanently discarded and the original mock data restored.</p>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Cancel</button><button class="btn btn-danger" id="confirmReset">Reset Demo Data</button></div>
  `);
}

function modalViewProfile(){
  const a = state.admins[0];
  openModal(`
    <div class="modal-head"><h3>Administrator Profile</h3><button class="close-x" data-close="1">✕</button></div>
    <div class="modal-body" style="text-align:center;">
      <div class="sb-avatar" style="margin:0 auto 14px;width:70px;height:70px;font-size:22px;">${initialsOf(a?.name)}</div>
      <h3>${a?.name}</h3>
      <p class="cell-sub" style="margin-top:4px;">${a?.role} · ${a?.email}</p>
    </div>
    <div class="modal-foot"><button class="btn btn-outline" data-close="1">Close</button></div>
  `);
}

/* =========================================================================
   EVENT HANDLING
   ========================================================================= */
function fieldError(inputEl, show){
  if(!inputEl) return;
  inputEl.classList.toggle('field-err', show);
}
function validateRequired(ids){
  let ok = true;
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    const bad = !el.value || !el.value.trim();
    fieldError(el, bad);
    if(bad) ok = false;
  });
  return ok;
}

function attachEvents(){
  // tooltip for collapsed sidebar
  document.querySelectorAll('.sb-link').forEach(link=>{
    link.addEventListener('mouseenter', (e)=>{
      if(!state.sidebarCollapsed) return;
      const tip = document.createElement('div');
      tip.className = 'sb-tooltip';
      tip.textContent = link.dataset.tip;
      document.body.appendChild(tip);
      const r = link.getBoundingClientRect();
      tip.style.left = (r.right+10)+'px';
      tip.style.top = (r.top+r.height/2-12)+'px';
      requestAnimationFrame(()=>tip.classList.add('show'));
      link._tip = tip;
    });
    link.addEventListener('mouseleave', ()=>{ if(link._tip){ link._tip.remove(); link._tip=null; } });
  });
}

document.addEventListener('click', function(e){
  // sidebar nav
  const navLink = e.target.closest('.sb-link[data-page], .pp-link[data-page], a[data-page]');
  if(navLink){
    e.preventDefault();
    if(navLink.dataset.page==='logout'){ toast('Logged out.'); setTimeout(()=>{ window.location.href = 'index.html'; }, 600); return; }
    state.page = navLink.dataset.page;
    state.sidebarMobileOpen = false;
    if(state.page==='students'){} // keep filters
    render();
    return;
  }
  if(e.target.closest('#backToDashBtn')){ state.page='dashboard'; render(); return; }
  if(e.target.closest('#logoutBtn2')){ toast('Logged out.'); setTimeout(()=>{ window.location.href = 'index.html'; }, 600); return; }

  // hamburger: collapse on desktop, slide on mobile
  if(e.target.closest('#hamburgerBtn')){
    if(window.innerWidth <= 900){ state.sidebarMobileOpen = !state.sidebarMobileOpen; }
    else{ state.sidebarCollapsed = !state.sidebarCollapsed; }
    render();
    return;
  }
  if(e.target.closest('#sbBackdrop')){ state.sidebarMobileOpen=false; render(); return; }

  // notif / profile dropdowns
  if(e.target.closest('#notifBtn')){
    e.stopPropagation();
    document.getElementById('notifPanel').classList.toggle('hidden');
    document.getElementById('profilePanel')?.classList.add('hidden');
    return;
  }
  if(e.target.closest('#profileBtn')){
    e.stopPropagation();
    document.getElementById('profilePanel').classList.toggle('hidden');
    document.getElementById('notifPanel')?.classList.add('hidden');
    return;
  }
  if(e.target.closest('#markAllReadBtn')){ state.notifications.forEach(n=>n.read=true); render(); toast('All notifications marked as read.'); return; }
  if(e.target.closest('#viewProfileBtn')){ e.preventDefault(); modalViewProfile(); return; }
  if(!e.target.closest('.dropdown')){
    document.getElementById('notifPanel')?.classList.add('hidden');
    document.getElementById('profilePanel')?.classList.add('hidden');
  }

  // tabs (admin users page)
  const tabBtn = e.target.closest('.tab-btn[data-tab]');
  if(tabBtn){ adminUsersTab = tabBtn.dataset.tab; render(); return; }

  // modal close
  if(e.target.closest('[data-close]')){ closeModal(); return; }
  if(e.target.id==='modalBg'){ closeModal(); return; }

  // ---- Students page actions ----
  if(e.target.closest('#addStudentBtn')){ modalAddStudent(); return; }
  if(e.target.closest('#exportStudentsBtn')){ toast('Export started (demo) — check your downloads folder.'); return; }
  const va = e.target.closest('[data-action="view-student"]');
  if(va){ modalViewStudent(va.dataset.id); return; }
  const ea = e.target.closest('[data-action="edit-student"]');
  if(ea){ modalEditStudent(ea.dataset.id); return; }
  const da = e.target.closest('[data-action="deactivate-student"]');
  if(da){ modalDeactivateStudent(da.dataset.id); return; }
  if(e.target.closest('#confirmDeactivate')){
    const id = e.target.closest('#confirmDeactivate').dataset.id;
    const s = studentById(id); if(s) s.accountStatus='Inactive';
    closeModal(); render(); toast('Student deactivated.', 'err');
    return;
  }
  if(e.target.closest('[data-action="print-clearance"]')){ window.print(); return; }

  // ---- Add Student submit ----
  if(e.target.id==='asSubmit'){
    const ok = validateRequired(['asId','asName','asEmail','asContact','asSection']);
    if(!ok){ document.getElementById('asErr').style.display='block'; toast('Please complete all required fields.', 'warn'); return; }
    const id = document.getElementById('asId').value.trim();
    if(studentById(id)){ toast('A student with that ID already exists.', 'err'); return; }
    const clearance = {}; OFFICES.forEach(o=>clearance[o]='Pending');
    state.students.push({
      id, name:document.getElementById('asName').value.trim(), email:document.getElementById('asEmail').value.trim(),
      contact:document.getElementById('asContact').value.trim(), department:document.getElementById('asDept').value,
      grade:document.getElementById('asGrade').value, section:document.getElementById('asSection').value.trim(),
      status:'Pending', accountStatus:'Active', clearance, dateSubmitted: new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}),
    });
    closeModal(); render(); toast('Student successfully added.');
    return;
  }
  // ---- Edit Student submit ----
  if(e.target.id==='esSubmit'){
    const id = e.target.dataset.id;
    const ok = validateRequired(['esName','esEmail','esContact','esSection']);
    if(!ok){ toast('Please complete all required fields.', 'warn'); return; }
    const s = studentById(id);
    s.name=document.getElementById('esName').value.trim(); s.email=document.getElementById('esEmail').value.trim();
    s.contact=document.getElementById('esContact').value.trim(); s.department=document.getElementById('esDept').value;
    s.grade=document.getElementById('esGrade').value; s.section=document.getElementById('esSection').value.trim();
    closeModal(); render(); toast('Changes saved successfully.');
    return;
  }

  // ---- Admin Users / Faculty ----
  if(e.target.closest('#addAdminBtn')){ modalAddAdmin(); return; }
  if(e.target.id==='aaSubmit'){
    const ok = validateRequired(['aaName','aaUser','aaEmail','aaPass']);
    if(!ok){ toast('Please complete all required fields.', 'warn'); return; }
    state.admins.push({name:document.getElementById('aaName').value.trim(), username:document.getElementById('aaUser').value.trim(),
      email:document.getElementById('aaEmail').value.trim(), role:document.getElementById('aaRole').value});
    closeModal(); render(); toast('Admin account created.');
    return;
  }
  if(e.target.closest('#addFacultyBtn')){ modalAddFaculty(); return; }
  if(e.target.id==='afSubmit'){
    const ok = validateRequired(['afId','afName','afEmail','afContact','afDesig','afCampus']);
    if(!ok){ toast('Please complete all required fields.', 'warn'); return; }
    const emp = document.querySelector('input[name="afEmp"]:checked').value;
    state.faculty.push({empId:document.getElementById('afId').value.trim(), name:document.getElementById('afName').value.trim(),
      email:document.getElementById('afEmail').value.trim(), contact:document.getElementById('afContact').value.trim(),
      department:document.getElementById('afDept').value, designation:document.getElementById('afDesig').value.trim(),
      campus:document.getElementById('afCampus').value.trim(), employment:emp});
    closeModal(); render(); toast('Faculty member added.');
    return;
  }

  // ---- Clearance requests ----
  const vr = e.target.closest('[data-action="view-request"]');
  if(vr){ modalViewRequest(vr.dataset.id); return; }
  const apr = e.target.closest('[data-action="approve-request"]');
  if(apr && !apr.disabled){ modalApproveRequest(apr.dataset.id); return; }
  const rej = e.target.closest('[data-action="reject-request"]');
  if(rej && !rej.disabled){ modalRejectRequest(rej.dataset.id); return; }

  if(e.target.id==='confirmApprove'){
    const reqId = e.target.dataset.id;
    const r = state.clearanceRequests.find(x=>x.requestId===reqId);
    if(r){
      r.status='Approved';
      const s = studentById(r.studentId);
      if(s){ s.clearance[r.currentOffice]='Approved'; s.status = computeOverallStatus(s.clearance);
        if(s.status==='Completed') s.dateCompleted = new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}); }
      state.notifications.unshift({title:'Clearance approved', text:`${s?s.name:r.studentId}'s ${r.currentOffice} requirement was approved.`, time:'Just now', read:false});
    }
    closeModal(); render(); toast('Clearance approved successfully.');
    return;
  }
  if(e.target.id==='confirmReject'){
    const reqId = e.target.dataset.id;
    const reasonEl = document.getElementById('rejectReason');
    if(!reasonEl.value.trim()){ fieldError(reasonEl,true); toast('Please provide a reason for rejection.', 'warn'); return; }
    const r = state.clearanceRequests.find(x=>x.requestId===reqId);
    if(r){
      r.status='Rejected';
      const s = studentById(r.studentId);
      if(s){ s.clearance[r.currentOffice]='Rejected'; s.status='Rejected'; s.rejectReason = reasonEl.value.trim(); }
      state.notifications.unshift({title:'Clearance rejected', text:`${s?s.name:r.studentId}'s ${r.currentOffice} requirement was rejected.`, time:'Just now', read:false});
    }
    closeModal(); render(); toast('Clearance rejected. Student notification created.', 'warn');
    return;
  }

  // ---- Departments ----
  if(e.target.closest('#addOfficeBtn')){ modalAddOffice(); return; }
  if(e.target.id==='aoSubmit'){
    const ok = validateRequired(['aoName']);
    if(!ok){ toast('Please enter an office name.', 'warn'); return; }
    state.offices.push({name:document.getElementById('aoName').value.trim(), status:'Active'});
    closeModal(); render(); toast('Office added.');
    return;
  }
  const eo = e.target.closest('[data-action="edit-office"]');
  if(eo){ modalEditOffice(eo.dataset.name); return; }
  if(e.target.id==='eoSubmit'){
    const orig = e.target.dataset.orig;
    const office = state.offices.find(o=>o.name===orig);
    if(office) office.name = document.getElementById('eoName').value.trim();
    closeModal(); render(); toast('Office updated.');
    return;
  }
  const to = e.target.closest('[data-action="toggle-office"]');
  if(to){
    const office = state.offices.find(o=>o.name===to.dataset.name);
    if(office){ office.status = office.status==='Active'?'Inactive':'Active'; render(); toast(`${office.name} ${office.status==='Active'?'activated':'deactivated'}.`, office.status==='Active'?undefined:'err'); }
    return;
  }

  // ---- Requirements ----
  if(e.target.closest('#addRequirementBtn')){ modalAddRequirement(); return; }
  if(e.target.id==='arSubmit'){
    const ok = validateRequired(['arName']);
    if(!ok){ toast('Please enter a requirement name.', 'warn'); return; }
    state.requirements.push({office:document.getElementById('arOffice').value, requirement:document.getElementById('arName').value.trim(), required:document.getElementById('arRequired').value, status:'Active'});
    closeModal(); render(); toast('Requirement added.');
    return;
  }
  const erb = e.target.closest('[data-action="edit-req"]');
  if(erb){ modalEditRequirement(parseInt(erb.dataset.i)); return; }
  if(e.target.id==='erSubmit'){
    const i = parseInt(e.target.dataset.i);
    const r = state.requirements[i];
    r.office=document.getElementById('erOffice').value; r.requirement=document.getElementById('erName').value.trim(); r.required=document.getElementById('erRequired').value;
    closeModal(); render(); toast('Requirement updated.');
    return;
  }
  const trb = e.target.closest('[data-action="toggle-req"]');
  if(trb){
    const r = state.requirements[parseInt(trb.dataset.i)];
    r.status = r.status==='Active'?'Inactive':'Active';
    render(); toast(`Requirement ${r.status==='Active'?'activated':'deactivated'}.`, r.status==='Active'?undefined:'err');
    return;
  }

  // ---- Reports ----
  if(e.target.closest('#printReportBtn')){ window.print(); return; }

  // ---- Settings ----
  if(e.target.closest('#resetDataBtn')){ modalConfirmReset(); return; }
  if(e.target.id==='confirmReset'){
    localStorage.removeItem(STORAGE_KEY);
    const fresh = defaultData();
    Object.assign(state, fresh);
    state.page='dashboard';
    closeModal(); render(); toast('Demo data has been reset.');
    return;
  }
});

/* filters / search / selects */
document.addEventListener('input', function(e){
  if(e.target.id==='studentSearchInput'){
    state.search = e.target.value;
    const tb = document.getElementById('studentsTbody'); if(tb) tb.innerHTML = renderStudentRows();
  }
});
document.addEventListener('change', function(e){
  if(e.target.id==='statusFilterSel'){ state.filters.status = e.target.value; document.getElementById('studentsTbody').innerHTML = renderStudentRows(); }
  if(e.target.id==='deptFilterSel'){ state.filters.department = e.target.value; document.getElementById('studentsTbody').innerHTML = renderStudentRows(); }
  if(e.target.id==='gradeFilterSel'){ state.filters.grade = e.target.value; document.getElementById('studentsTbody').innerHTML = renderStudentRows(); }
  if(e.target.id==='rfDept'){ state.reportFilters.department = e.target.value; render(); }
  if(e.target.id==='rfGrade'){ state.reportFilters.grade = e.target.value; render(); }
});

/* forms that reload the page (deadline) */
document.addEventListener('submit', function(e){
  if(e.target.id==='deadlineForm'){
    e.preventDefault();
    state.deadline = { schoolYear:document.getElementById('dlYear').value, start:document.getElementById('dlStart').value, end:document.getElementById('dlEnd').value };
    render(); toast('Clearance deadline updated.');
  }
  // prevent native submit on modal forms (buttons handle logic)
  if(['addStudentForm','editStudentForm','addAdminForm','addFacultyForm','addOfficeForm','editOfficeForm','addReqForm','editReqForm'].includes(e.target.id)){
    e.preventDefault();
  }
});

/* escape key closes modal */
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){ closeModal(); }
});

render();