from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str, smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

CustomUser = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'password', 'password2']

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio', 'profile_picture']
        read_only_fields = ['username', 'email']

    def update(self, instance, validated_data):
        instance.bio = validated_data.get('bio', instance.bio)
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data.get('profile_picture')
        instance.save()
        return instance


# Password Reset - Step 1: Request Email
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


# Password Reset - Step 2: Confirm New Password
class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    re_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = smart_str(urlsafe_base64_decode(attrs['uid']))
            user = CustomUser.objects.get(id=uid)
        except (DjangoUnicodeDecodeError, CustomUser.DoesNotExist):
            raise serializers.ValidationError("Invalid reset link.")

        if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid or expired token.")

        if attrs['new_password'] != attrs['re_new_password']:
            raise serializers.ValidationError("Passwords do not match.")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
