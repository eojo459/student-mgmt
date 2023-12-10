from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import NewsLetter
from .serializers import NewsLetterSerializer

from user.models import User


class NewsLetterTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = get_user_model().objects.create_user(
            username='testadmin',
            email='test@admin.com',
            password='adminpass',
            role='ADMIN'
        )
        self.client.force_authenticate(user=self.admin_user)
        self.newsletter1 = NewsLetter.objects.create(title='Test Newsletter 1', content='This is a test newsletter 1.')
        self.newsletter2 = NewsLetter.objects.create(title='Test Newsletter 2', content='This is a test newsletter 2.')
        self.valid_payload = {
            'title': 'New Newsletter',
            'content': 'This is a new newsletter.'
        }
        self.invalid_payload = {
            'title': '',
            'content': ''
        }

    def test_get_all_newsletters(self):
        response = self.client.get(reverse('newsletter_list'))
        newsletters = NewsLetter.objects.all()
        serializer = NewsLetterSerializer(newsletters, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_valid_newsletter(self):
        response = self.client.post(
            reverse('newsletter_list'),
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_newsletter(self):
        response = self.client.post(
            reverse('newsletter_list'),
            data=self.invalid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_valid_single_newsletter(self):
        response = self.client.get(
            reverse('newsletter_detail', kwargs={'pk': self.newsletter1.pk})
        )
        newsletter = NewsLetter.objects.get(pk=self.newsletter1.pk)
        serializer = NewsLetterSerializer(newsletter)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_newsletter(self):
        response = self.client.get(
            reverse('newsletter_detail', kwargs={'pk': 999})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_valid_newsletter(self):
        response = self.client.delete(
            reverse('newsletter_detail', kwargs={'pk': self.newsletter1.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_invalid_newsletter(self):
        response = self.client.delete(
            reverse('newsletter_detail', kwargs={'pk': 999})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
