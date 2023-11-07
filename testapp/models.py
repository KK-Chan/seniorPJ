from django.contrib.gis.db import models


class AsanSlib(models.Model):
    geom = models.PointField(srid=5179, blank=True, null=True)
    도서관명 = models.CharField(max_length=254, blank=True, null=True)
    주소 = models.CharField(max_length=254, blank=True, null=True)
    x = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    y = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Asan_SLib'


class AsanAdong5179(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    objectid = models.BigIntegerField(blank=True, null=True)
    adm_nm = models.CharField(max_length=80, blank=True, null=True)
    adm_cd = models.CharField(max_length=80, blank=True, null=True)
    adm_cd2 = models.CharField(max_length=80, blank=True, null=True)
    sgg = models.CharField(max_length=80, blank=True, null=True)
    sido = models.CharField(max_length=80, blank=True, null=True)
    sidonm = models.CharField(max_length=80, blank=True, null=True)
    temp = models.CharField(max_length=80, blank=True, null=True)
    sggnm = models.CharField(max_length=80, blank=True, null=True)
    adm_cd8 = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Asan_adong_5179'


class AsanGridPop(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    gid = models.CharField(max_length=254, blank=True, null=True)
    lbl = models.CharField(max_length=254, blank=True, null=True)
    val = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Asan_grid_pop'


class AsanGrid500M(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    gid = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asan_grid_500m'


class Asanemdpop(models.Model):
    id_0 = models.AutoField(primary_key=True)
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    id = models.BigIntegerField(blank=True, null=True)
    adm_nm = models.CharField(max_length=80, blank=True, null=True)
    adm_cd = models.CharField(max_length=80, blank=True, null=True)
    adm_cd2 = models.CharField(max_length=80, blank=True, null=True)
    sgg = models.CharField(max_length=80, blank=True, null=True)
    sido = models.CharField(max_length=80, blank=True, null=True)
    sidonm = models.CharField(max_length=80, blank=True, null=True)
    temp = models.CharField(max_length=80, blank=True, null=True)
    sggnm = models.CharField(max_length=80, blank=True, null=True)
    adm_cd8 = models.CharField(max_length=80, blank=True, null=True)
    읍면동 = models.CharField(max_length=80, blank=True, null=True)
    총인구 = models.CharField(max_length=80, blank=True, null=True)
    유아 = models.CharField(max_length=80, blank=True, null=True)
    초등학생 = models.CharField(max_length=80, blank=True, null=True)
    중학생 = models.CharField(max_length=80, blank=True, null=True)
    고등학생 = models.CharField(max_length=80, blank=True, null=True)
    성인 = models.CharField(max_length=80, blank=True, null=True)
    생산가능 = models.CharField(max_length=80, blank=True, null=True)
    노인 = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asan_emd_pop'



class 천안아산시_SOC(models.Model):
    id = models.IntegerField(primary_key=True)
    geom = models.PointField(srid=5179, blank=True, null=True)
    id_0 = models.BigIntegerField(blank=True, null=True)
    sgg_nm_k = models.CharField(max_length=80, blank=True, null=True)
    sgg_cd = models.CharField(max_length=80, blank=True, null=True)
    sido_nm_k = models.CharField(max_length=80, blank=True, null=True)
    sido_cd = models.CharField(max_length=80, blank=True, null=True)
    fac_nm = models.CharField(max_length=80, blank=True, null=True)
    fac_add = models.CharField(max_length=174, blank=True, null=True)
    emd_nm = models.CharField(max_length=80, blank=True, null=True)
    type = models.CharField(max_length=80, blank=True, null=True)
    x = models.CharField(max_length=80, blank=True, null=True)
    y = models.CharField(max_length=80, blank=True, null=True)
    layer = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '천안아산시_SOC'




class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Layer(models.Model):
    topology = models.OneToOneField('Topology', models.DO_NOTHING, primary_key=True)  # The composite primary key (topology_id, layer_id) found, that is not supported. The first column is selected.
    layer_id = models.IntegerField()
    schema_name = models.CharField(max_length=255)
    table_name = models.CharField(max_length=255)
    feature_column = models.CharField(max_length=255)
    feature_type = models.IntegerField()
    level = models.IntegerField()
    child_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'layer'
        unique_together = (('topology', 'layer_id'), ('schema_name', 'table_name', 'feature_column'),)


class Topology(models.Model):
    name = models.CharField(unique=True, max_length=255)
    srid = models.IntegerField()
    precision = models.FloatField()
    hasz = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'topology'


class 경관지구_분류_아산_5179(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    코드값 = models.CharField(max_length=80, blank=True, null=True)
    코드값의미 = models.CharField(max_length=80, blank=True, null=True)
    mnum = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '경관지구_분류_아산_5179'


class 국토계획_분류_아산_5179(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    코드값 = models.CharField(max_length=80, blank=True, null=True)
    코드값의미 = models.CharField(max_length=80, blank=True, null=True)
    mnum = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '국토계획_분류_아산_5179'


class 도시지역_분류_아산_5179(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    코드값 = models.CharField(max_length=80, blank=True, null=True)
    코드값의미 = models.CharField(max_length=80, blank=True, null=True)
    mnum = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '도시지역_분류_아산_5179'



class 지적_아산시_5179(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    sgg_oid = models.BigIntegerField(blank=True, null=True)
    jibun = models.CharField(max_length=100, blank=True, null=True)
    bchk = models.CharField(max_length=1, blank=True, null=True)
    pnu = models.CharField(max_length=19, blank=True, null=True)
    col_adm_se = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '지적_아산시_5179'

class 아산시500M인구(models.Model):
    geom = models.MultiPolygonField(srid=5179, blank=True, null=True)
    gid = models.CharField(max_length=254, blank=True, null=True)
    lbl = models.CharField(max_length=254, blank=True, null=True)
    val = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '아산_500m_1'


class Pyogo(models.Model):
    rid = models.AutoField(primary_key=True)
    rast = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'pyogo'
