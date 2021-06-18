import json
from datetime import date

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from freezegun import freeze_time
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.test import APITestCase

from blog.models import Entry
from blog.serializer import MicropubEntrySerializer


class MicropubSerializerTests(APITestCase):
    permission_classes = [DjangoModelPermissions]

    def test_micropub(self):
        form_data = {'h': 'entry', 'content': 'Hello World'}

        serializer = MicropubEntrySerializer(data=form_data)
        self.assertTrue(serializer.is_valid(raise_exception=True))
        entry = MicropubEntrySerializer.create_entry(serializer.validated_data)

        self.assertEqual('Hello World', entry.content)


class MicropubEndpointTests(APITestCase):
    def setUp(self) -> None:
        self.disallowed_user = get_user_model().objects.create_user(username='foobar', password='7812')
        self.allowed_user = get_user_model().objects.create_user(username='testuser', password='12345')
        self.allowed_user.user_permissions.add(Permission.objects.get(codename='add_entry'))

    def post(self, **params):
        return self.client.post('/api/micropub/', params)

    def get(self, **params):
        return self.client.get('/api/micropub/', params)

    def test_get_fails_without_q(self):
        response = self.get()

        self.assertEqual(400, response.status_code)
        data = json.loads(response.content)
        self.assertEqual('invalid_request', data['error'])

    def test_post_fails_without_h(self):
        response = self.post()

        self.assertEqual(400, response.status_code)
        data = json.loads(response.content)
        self.assertEqual('invalid_request', data['error'])

    def test_get_syndication_targets(self):
        response = self.get(q='syndicate-to')

        self.assertEqual(200, response.status_code, msg=response.content)
        data = json.loads(response.content)

    def test_get_config(self):
        pass

    def test_get_source(self):
        pass

    @freeze_time("2012-01-14 03:21:34", tz_offset=-4)
    def test_create_valid_entry_1(self):
        form = {
            'h': 'entry',
            'name': 'Hello World!',
            'content': 'My post content dot jay peg',
            'category': ['cpp', 'django', 'python']
        }

        response = self.post(**form)

        self.assertEqual(202, response.status_code, msg=response.content)
        entry = Entry.objects.get()
        self.assertEqual(date(2012, 1, 13), entry.date)
        self.assertEqual(form['name'], entry.title)
        self.assertEqual(form['content'], entry.content)
        self.assertIsNotNone(entry.tags.get(short_name='cpp'))
        self.assertIsNotNone(entry.tags.get(short_name='django'))
        self.assertIsNotNone(entry.tags.get(short_name='python'))
