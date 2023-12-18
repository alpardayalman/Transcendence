from django.urls import path

from . import views

urlpatterns = [
  path("", views.home, name="home"),
  path("owner/", views.OwnerList.as_view(), name="ownerlist"),
  path("owner/create/", views.OwnerCreate.as_view(), name="ownercreate"),
  path("owner/<int:pk>/update/", views.OwnerUpdate.as_view(), name="ownerupdate"),
  path("owner/<int:pk>/delete/", views.OwnerDelete.as_view(), name="ownerdelete"),
  
  path("patient/", views.PatientList.as_view(), name="patientlist"),
  path("patient/create/", views.PatientCreate.as_view(), name="patientcreate"),
  path("patient/<pk>/update/", views.PatientUpdate.as_view(), name="patientupdate"),
  path("patient/<pk>/delete/", views.PatientDelete.as_view(), name="patientdelete"),
]