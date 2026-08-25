from rest_framework import serializers
from skills.serializers import SkillSerializer
from skills.models import Skill
from institutions.serializers import InstitutionSerializer
from institutions.models import Institution
from courses.models import LearningResource, LearningRecommendation, CourseEnrollment, CoursePayment


class LearningResourceSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    skill_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    institution = InstitutionSerializer(read_only=True)
    institution_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    is_enrolled = serializers.SerializerMethodField()
    enrollment_id = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = LearningResource
        fields = [
            'id',
            'title',
            'description',
            'skill',
            'skill_id',
            'skill_name',
            'institution',
            'institution_id',
            'instructor_name',
            'thumbnail_url',
            'level',
            'resource_type',
            'content_url',
            'duration_minutes',
            'rating',
            'enrolled_count',
            'price',
            'original_price',
            'is_free',
            'certificate_included',
            'what_you_will_learn',
            'curriculum',
            'faqs',
            'is_active',
            'is_enrolled',
            'enrollment_id',
            'user_progress',
            'created_at',
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            if hasattr(request.user, 'student_profile'):
                return CourseEnrollment.objects.filter(
                    student=request.user.student_profile,
                    resource=obj
                ).exists()
        return False

    def get_enrollment_id(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            if hasattr(request.user, 'student_profile'):
                enr = CourseEnrollment.objects.filter(
                    student=request.user.student_profile,
                    resource=obj
                ).first()
                return str(enr.id) if enr else None
        return None

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            if hasattr(request.user, 'student_profile'):
                enr = CourseEnrollment.objects.filter(
                    student=request.user.student_profile,
                    resource=obj
                ).first()
                return enr.progress_percent if enr else 0
        return 0

    def create(self, validated_data):
        skill_id = validated_data.pop('skill_id', None)
        skill_name = validated_data.pop('skill_name', None)
        inst_id = validated_data.pop('institution_id', None)

        if skill_id:
            try:
                validated_data['skill'] = Skill.objects.get(id=skill_id)
            except Skill.DoesNotExist:
                pass
        elif skill_name:
            skill_obj, _ = Skill.objects.get_or_create(
                name=skill_name.strip(),
                defaults={'category': 'Technical'}
            )
            validated_data['skill'] = skill_obj

        if 'skill' not in validated_data:
            fallback_skill = Skill.objects.first()
            if not fallback_skill:
                fallback_skill = Skill.objects.create(name='General Engineering', category='Technical')
            validated_data['skill'] = fallback_skill

        if inst_id:
            try:
                validated_data['institution'] = Institution.objects.get(id=inst_id)
            except Institution.DoesNotExist:
                pass

        return super().create(validated_data)


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    resource = LearningResourceSerializer(read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = [
            'id',
            'resource',
            'status',
            'progress_percent',
            'completed_lessons',
            'last_played_lesson_id',
            'enrolled_at',
            'completed_at',
            'certificate_id',
        ]


class CoursePaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoursePayment
        fields = [
            'id',
            'amount',
            'payment_method',
            'transaction_id',
            'status',
            'created_at',
        ]


class LearningRecommendationSerializer(serializers.ModelSerializer):
    resource = LearningResourceSerializer(read_only=True)
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = LearningRecommendation
        fields = [
            'id',
            'skill',
            'skill_name',
            'resource',
            'priority',
            'reason',
            'status',
            'completed_at',
            'created_at',
        ]
