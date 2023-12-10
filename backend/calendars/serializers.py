from rest_framework import serializers
from .models import calendar,day
class daySerializer(serializers.ModelSerializer):
    class Meta:
        model = day
        fields = ['description','Date','holiday']
class calendarSerializer(serializers.ModelSerializer):
    # days = daySerializer(many=True)
    # days = serializers.PrimaryKeyRelatedField(many=True, queryset=day.objects.all())
    # days = serializers.ManyRelatedField(required=False)
    class Meta:
        model = calendar
        fields = '__all__'

class calendarSerializerGet(serializers.ModelSerializer):
    days = daySerializer(many=True)
    # days = serializers.PrimaryKeyRelatedField(many=True, queryset=day.objects.all())
    # days = serializers.ManyRelatedField(required=False)
    class Meta:
        model = calendar
        fields = '__all__'

