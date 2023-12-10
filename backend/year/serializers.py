from rest_framework import serializers
from .models import AcademicYear, CurrentAcademicYear

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['year', 'id']
        depth = 0

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['year'] = instance.year
        return ret


class CurrentAcademicYearSerializer(serializers.ModelSerializer):
    academic_year = AcademicYearSerializer()

    class Meta:
        model = CurrentAcademicYear
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['academic_year'] = instance.academic_year.year
        return ret
